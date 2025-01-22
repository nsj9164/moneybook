const express = require("express");
const db = require("./database/db");
const app = express();
const port = "8009";
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// app.get('/config', (req, res) => {
//     res.json({ host: process.env.HOST, port: process.env.PORT });
// })

app.listen(port, (req, res) => {
  //console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
});

app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
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

// API 라우트
app.post("/payList", authenticateToken, function (req, res) {
  db.query(
    `SELECT id
                   , DATE_FORMAT(date,"%Y-%m-%d") as date
                   , cat_nm
                   , content
                   , FORMAT(price1,0) as price1
                   , FORMAT(price2,0) as price2
                   , payment
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

app.post("/payList/insert", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    if (item.isNew) {
      db.query(
        "INSERT INTO PAYLIST (date, cat_nm, content, price1, price2, payment, remark, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.date.replace(/-/g, ""),
          item.cat_nm,
          item.content,
          item.price1.replace(/,/g, ""),
          item.price2.replace(/,/g, ""),
          item.payment,
          item.remark,
          userId,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    } else if (item.isModified) {
      db.query(
        "UPDATE PAYLIST SET date = ?, cat_nm = ?, content = ?, price1 = ?, price2 = ?, payment = ?, remark = ? WHERE id = ?",
        [
          item.date.replace(/-/g, ""),
          item.cat_nm,
          item.content,
          item.price1.replace(/,/g, ""),
          item.price2.replace(/,/g, ""),
          item.payment,
          item.remark,
          item.id,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    }
  });

  res.send({ message: "Data saved successfully!" });
});

app.post("/payList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    db.query(
      `DELETE FROM PAYLIST
                   WHERE user_id = ?
                     AND id = ?`,
      [userId, item.id],
      (err, result) => {
        if (err) throw err;
      }
    );
  });
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
                   , DATE_FORMAT(expense_date,"%Y-%m-%d") as expense_date
                   , expense_desc
                   , FORMAT(expense_amount,0) as expense_amount
                   , expense_payment
                   , expense_cat_nm
                FROM FIXCED_ITEM_LIST
               WHERE USER_ID = ?
               ORDER BY expense_date, expense_id`,
    [req.user.userId],
    function (err, results, fields) {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.post("/fixedItemList/insert", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    if (item.isNew) {
      db.query(
        "INSERT INTO FIXCED_ITEM_LIST (expense_date, expense_desc, expense_amount, expense_payment, expense_cat_nm, reg_dt, USER_ID) VALUES (?, ?, ?, ?, ?, SYSDATE(), ?)",
        [
          item.expense_date,
          item.expense_desc,
          item.expense_amount,
          item.expense_payment,
          item.expense_cat_nm,
          userId,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    } else if (item.isModified) {
      db.query(
        "UPDATE FIXCED_ITEM_LIST SET expense_date = ?, expense_desc = ?, expense_amount = ?, expense_payment = ?, expense_cat_nm = ?, UPD_DT = SYSDATE() WHERE expense_id = ?",
        [
          item.expense_date,
          item.expense_desc,
          item.expense_amount,
          item.expense_payment,
          item.expense_cat_nm,
          item.expense_id,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    }
  });

  res.send({ message: "Data saved successfully!" });
});

app.post("/fixedItemList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    db.query(
      `DELETE FROM FIXCED_ITEM_LIST
                   WHERE user_id = ?
                     AND expense_id = ?`,
      [userId, item.expense_id],
      (err, result) => {
        if (err) throw err;
      }
    );
  });
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

app.post("/cardList/insert", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    if (item.isNew) {
      db.query(
        "INSERT INTO CARD_INFO (card_company, card_name, card_type, payment_due_date, usage_period_start, usage_period_end, active_status, reg_dt, USER_ID) VALUES (?, ?, ?, ?, ?, ?, SYSDATE(), ?)",
        [
          item.card_company,
          item.card_name,
          item.card_type,
          item.payment_due_date,
          item.usage_period_start,
          item.usage_period_end,
          item.active_status,
          userId,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    } else if (item.isModified) {
      db.query(
        "UPDATE CARD_INFO SET card_company = ?, card_name = ?, card_type = ?, payment_due_date = ?, usage_period_start = ?, usage_period_end = ?, active_status = ?, UPD_DT = SYSDATE() WHERE card_id = ?",
        [
          item.card_company,
          item.card_name,
          item.card_type,
          item.payment_due_date,
          item.usage_period_start,
          item.usage_period_end,
          item.active_status,
          item.card_id,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    }
  });

  res.send({ message: "Data saved successfully!" });
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

app.post("/categoryList/insert", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;

  data.forEach((item) => {
    if (item.isNew) {
      db.query(
        "INSERT INTO CATEGORY_INFO (category_nm, reg_dt, USER_ID) VALUES (?, SYSDATE(), ?)",
        [item.category_nm, userId],
        (err, result) => {
          if (err) throw err;
        }
      );
    } else if (item.isModified) {
      db.query(
        "UPDATE CATEGORY_INFO SET category_nm = ?, UPD_DT = SYSDATE() WHERE cat_id = ?",
        [item.category_nm, item.cat_id],
        (err, result) => {
          if (err) throw err;
        }
      );
    }
  });

  res.send({ message: "Data saved successfully!" });
});

app.post("/categoryList/delete", authenticateToken, function (req, res) {
  const userId = req.user.userId;
  const data = req.body;
  console.log("호출", data);
  db.query(
    `DELETE FROM CATEGORY_INFO
      WHERE user_id = ?
        AND cat_id = ?`,
    [userId, data],
    (err, result) => {
      if (err) {
        console.error("쿼리 에러:", err);
        res.status(500).send("쿼리 실행 실패");
        return;
      }
      console.log("삭제될 결과:", result);
      res.status(500).send("삭제 완료");
    }
  );
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../account/build", "index.html"));
});
