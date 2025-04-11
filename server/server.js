const express = require("express");
const db = require("./database/db");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.listen(PORT, (req, res) => {
  console.log(
    `Server running on http://${process.env.HOST}:${process.env.PORT}`
  );
});

app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
const { resolve } = require("path");
app.use(
  cors({
    origin: `http://localhost:3000`, // 클라이언트의 도메인
    credentials: true, // 쿠키 전송 허용
  })
);

// 정적파일 서빙
app.use(express.static(path.join(__dirname, "../account/build")));

// JWT 검증 미들웨어
const authenticateToken = (req, res, next) => {
  // 쿠키에서 JWT 가져오기
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }

    // 토큰에서 추출한 정보를 req 객체에 저장
    req.user = decoded;
    // 다음 미들웨어 또는 라우트로 진행
    next();
  });
};

// 저장하기 공통 모듈
async function saveData(
  tableName,
  data,
  userId,
  insertFields,
  updateFields,
  idField
) {
  try {
    const promises = data.map(async (item) => {
      if (item.isNew) {
        return new Promise((resolve, reject) => {
          const fieldNames = [...insertFields, "REG_DT", "USER_ID"];
          const placeholders = insertFields.map(() => "?").join(", ");
          const values = insertFields
            .map((field) => item[field] ?? null)
            .concat([userId]);

          db.query(
            `INSERT INTO ${tableName} (${fieldNames.join(
              ", "
            )}) VALUES (${placeholders}, SYSDATE(), ?)`,
            values,
            (err, result) => {
              if (err) reject(err);
              resolve({
                tempId: item[idField],
                insertId: result.insertId,
              });
            }
          );
        });
      } else if (item.isModified) {
        return new Promise((resolve, reject) => {
          const setClause = updateFields
            .map((field) => `${field} = ?`)
            .join(", ");
          const values = updateFields
            .map((field) => item[field])
            .concat([item[idField]]);

          db.query(
            `UPDATE ${tableName} SET ${setClause}, UPD_DT = SYSDATE() WHERE ${idField} = ?`,
            values,
            (err) => {
              if (err) reject(err);
              resolve(null);
            }
          );
        });
      }
    });

    const savedData = await Promise.all(promises);
    return savedData.filter((item) => item !== null);
  } catch (error) {
    throw error;
  }
}

// API 라우트
app.post("/payList", authenticateToken, function (req, res) {
  db.query(
    `SELECT id
          , DATE_FORMAT(date,"%Y-%m-%d") as date
          , cat_id
          , content
          , FORMAT(price1,0) as price1
          , FORMAT(price2,0) as price2
          , card_id
          , remark
       FROM PAYLIST
      WHERE USER_ID = ?
        AND DATE >= ?
        AND DATE <= ?
      ORDER BY DATE, ID`,
    [req.user.userId, req.body.start, req.body.end],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/payList/insert", authenticateToken, async function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  try {
    const filteredData = await saveData(
      "PAYLIST",
      data.map((item) => ({
        ...item,
        date: item.date ? item.date.replace(/-/g, "") : null,
        price1: item.price1 ? item.price1.replace(/,/g, "") : null,
        price2: item.price2 ? item.price2.replace(/,/g, "") : null,
      })),
      userId,
      ["date", "cat_id", "content", "price1", "price2", "card_id", "remark"],
      ["date", "cat_id", "content", "price1", "price2", "card_id", "remark"],
      "id"
    );
    res.json(filteredData);
  } catch (error) {
    console.error("❌ 데이터 저장 중 오류 발생:", error);
    res.status(500).json({ message: "데이터 저장 실패", error });
  }
});

app.post("/payList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  db.query(
    `DELETE FROM PAYLIST
                 WHERE user_id = ?
                   AND id in (?)`,
    [userId, data],
    (err, result) => {
      if (err) {
        console.error("저장 중 오류 발생:", error);
        res
          .status(500)
          .json({ status: 500, message: "삭제 중 오류가 발생했습니다." });
      } else {
        console.log("삭제 완료:", data);
        res
          .status(200)
          .json({ status: 200, message: "삭제되었습니다.", deletedIds: data });
      }
    }
  );
});

app.post("/loginCheck", function (req, res) {
  const { userId, userPw } = req.body;
  const sendData = { isLogin: "" };

  if (userId && userPw) {
    db.query(
      "SELECT * FROM USER WHERE USER_ID = ?",
      [userId],
      function (err, results, fields) {
        if (err) {
          console.log("Database error: ", err);
          sendData.isLogin = "서버 에러가 발생했습니다.";
          return res.status(500).send(sendData);
        }

        // bcrypt.compare : 올바르게 해시된 비밀번호와 사용자가 입력한 평문 비밀번호 비교
        if (results.length) {
          bcrypt.compare(userPw, results[0].USER_PW, (err, result) => {
            if (err) {
              console.error("Error during bcrypt comparison:", err);
              sendData.isLogin = "서버 에러가 발생했습니다.";
              return res.status(500).send(sendData);
            }

            if (result) {
              // expiresIn : 초 단위 또는 시간 간격을 나타내는 문자열
              const token = jwt.sign({ userId }, "secret_key", {
                expiresIn: "1h",
              });

              // httpOnly : 클라이언트에서 직접 접근할 수 없도록 설정
              // maxAge : 쿠키유지시간
              res.cookie("token", token, {
                httpOnly: false, // 이 부분을 false로 설정하면 쿠키를 클라이언트에서 읽을 수 있음
                secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서는 true로 설정
                sameSite: "lax",
                maxAge: 3600000, // 1시간
              });

              sendData.isLogin = "True";
              return res.status(200).send(sendData);
            } else {
              sendData.isLogin = "false";
              sendData.message = "로그인 정보가 일치하지 않습니다.";
              return res.status(401).send(sendData);
            }
          });
        } else {
          sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
          return res.status(401).send(sendData);
        }
        // 기존에는 res.send(sendData)가 여기 있었는데, bcrypt.compare()가 비동기적으로 작동하기 때문에
        // bcrypt.compare()의 결과를 기다리지 않고 res.send(sendData)가 먼저 실행되는 문제가 발생하여 수정함.
      }
    );
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력해 주세요.";
    return res.status(400).send(sendData);
  }
});

app.post("/logout", (req, res) => {
  console.log("you cookie is : ", req.cookies.token);
  // JWT 쿠키 삭제
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/fixedItemList", authenticateToken, function (req, res) {
  db.query(
    `SELECT expense_id
          , expense_date
          , expense_desc
          , FORMAT(expense_amount,0) as expense_amount
          , expense_payment
          , expense_cat_nm
      FROM FIXED_ITEM_LIST
      WHERE USER_ID = ?
      ORDER BY expense_date, expense_id`,
    [req.user.userId],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/fixedItemList/insert", authenticateToken, async function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  try {
    const filteredData = await saveData(
      "FIXED_ITEM_LIST",
      data,
      userId,
      [
        "expense_date",
        "expense_desc",
        "expense_amount",
        "expense_payment",
        "expense_cat_nm",
      ],
      [
        "expense_date",
        "expense_desc",
        "expense_amount",
        "expense_payment",
        "expense_cat_nm",
      ],
      "expense_id"
    );
    res.json(filteredData);
  } catch (error) {
    console.error("❌ 데이터 저장 중 오류 발생:", error);
    res.status(500).json({ message: "데이터 저장 실패", error });
  }
});

app.post("/fixedItemList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  if (data.length > 0) {
    const placeholders = data.map(() => "?").join(", ");

    db.query(
      `DELETE FROM FIXED_ITEM_LIST
        WHERE user_id = ?
          AND expense_id IN (${placeholders})`,
      [userId, ...data],
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  }
});

app.get("/cardList", authenticateToken, function (req, res) {
  db.query(
    `SELECT card_id
        , card_company
        , card_name
        , card_type
        , payment_due_date
        , usage_period_start
        , usage_period_end
        , active_status
    FROM CARD_INFO
    WHERE USER_ID = ?
    ORDER BY card_id`,
    [req.user.userId],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/cardList/insert", authenticateToken, async function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  try {
    const filteredData = await saveData(
      "CARD_INFO",
      data,
      userId,
      [
        "card_company",
        "card_name",
        "card_type",
        "payment_due_date",
        "usage_period_start",
        "usage_period_end",
        "active_status",
      ],
      [
        "card_company",
        "card_name",
        "card_type",
        "payment_due_date",
        "usage_period_start",
        "usage_period_end",
        "active_status",
      ],
      "card_id"
    );
    res.json(filteredData);
  } catch (error) {
    console.error("❌ 데이터 저장 중 오류 발생:", error);
    res.status(500).json({ message: "데이터 저장 실패", error });
  }
});

app.post("/cardList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    db.query(
      `DELETE FROM CARD_INFO
                   WHERE user_id = ?
                     AND card_id = ?`,
      [userId, item.card_id],
      (err, result) => {
        if (err) throw err;
      }
    );
  });
});

app.get("/cardCompanyList", authenticateToken, function (req, res) {
  db.query(
    `SELECT id, value, name 
       FROM card_companies
      WHERE use_yn = 'Y'
      ORDER BY id`,
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.get("/categoryList", authenticateToken, function (req, res) {
  db.query(
    `SELECT cat_id
          , category_nm
    FROM CATEGORY_INFO
    WHERE USER_ID = ?
    ORDER BY cat_id`,
    [req.user.userId],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/categoryList/insert", authenticateToken, async function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  try {
    const filteredData = await saveData(
      "CATEGORY_INFO",
      data,
      userId,
      ["category_nm"],
      ["category_nm"],
      "cat_id"
    );
    res.json(filteredData);
  } catch (error) {
    console.error("❌ 데이터 저장 중 오류 발생:", error);
    res.status(500).json({ message: "데이터 저장 실패", error });
  }
});

app.post("/categoryList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;
  db.query(
    `DELETE FROM CATEGORY_INFO
      WHERE user_id = ?
        AND cat_id = ?`,
    [userId, data],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../account/build", "index.html"));
});
