import classNames from "classnames";
import { useRef } from "react";
import { date } from "../../util/util";
import { Input } from "../EditableCell";
import { Overlay } from "../Overlay";
import CustomSelect from "../SelectComponent/CustomSelect";

const MyCardTable = ({
  fields,
  item,
  handleUpdate,
  handlePaymentPeriod,
  cardCompanyList,
  visibleOverlay,
  setVisibleOverlay,
  handleDelete,
  setIsButtonHovered,
}) => {
  const renderColumn = (col, idx, item) => {
    if (!item) return null;
    switch (col) {
      case "card_company":
        return (
          <CustomSelect
            key={idx}
            value={item[col]}
            options={cardCompanyList.map((list) => ({
              value: list.value,
              label: list.name,
            }))}
            defaultValue=""
            onChange={(value) => handleUpdate(value, item.card_id, col)}
          />
        );
      case "card_name":
        return (
          <Input
            key={col}
            onBlur={(e) => handleUpdate(e.target.innerText, item.card_id, col)}
          >
            {item[col]}
          </Input>
        );
      case "card_type":
        return (
          <CustomSelect
            key={idx}
            value={item[col]}
            options={[
              { value: "1", label: "신용카드" },
              { value: "2", label: "체크카드" },
            ]}
            onChange={(value) => handleUpdate(value, item.card_id, col)}
          />
        );
      case "payment_due_date":
        return (
          <CustomSelect
            key={idx}
            value={item[col]}
            options={Array.from({ length: 28 }, (_, j) => ({
              value: String(j + 1).padStart(2, "0"),
              label: String(j + 1).padStart(2, "0"),
            }))}
            defaultValue="01"
            onChange={(value) => handlePaymentPeriod(value, item.card_id, col)}
            disabled={item.card_type === "2"}
          />
        );
      case "active_status":
        return (
          <>
            <td key={idx}>
              <input type="checkbox" />
            </td>
            <td
              className="cursor_pointer"
              onClick={() => handleDelete(item.card_id)}
            >
              <div className="popover-wrapper w-100">
                <button
                  className={classNames("btn-delete", {
                    "btn-disabled": item.isDisabled,
                  })}
                  onClick={() => handleDelete(item.cat_id, item.isDisabled)}
                  onMouseEnter={
                    item.isDisabled ? () => setIsButtonHovered(true) : undefined
                  }
                  onMouseLeave={
                    item.isDisabled
                      ? () => setIsButtonHovered(false)
                      : undefined
                  }
                >
                  X
                </button>
                {item.isDisabled && visibleOverlay && (
                  <Overlay
                    overlayContent={
                      "카드명을 입력하기 전에는\n삭제할 수 없습니다."
                    }
                    setVisibleOverlay={setVisibleOverlay}
                  />
                )}
              </div>
            </td>
          </>
        );
      case "usage_period_start":
        const periodStart = item["usage_period_start"];
        const periodEnd = item["usage_period_end"];
        return (
          <td key={idx}>
            전전월 {periodStart}일 ~ 전월 {periodEnd}일
          </td>
        );
      default:
        null;
    }
  };

  return (
    <>
      {fields.map((col, idx) => (
        <>{renderColumn(col, idx, item)}</>
      ))}
    </>
  );
};

export default MyCardTable;
