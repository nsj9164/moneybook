import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteData,
  fetchData,
  saveData,
} from "../../store/features/payList/payListActions";
import { date } from "../../util/util";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import TableWrapper from "../../components/Table/TableWrapper";
import ButtonGroup from "./Summary/ButtonGroup";
import SummaryInfo from "./Summary/SummaryInfo";
import SaveButtonWrapper from "./Summary/SaveButtonWrapper";
import PayListFilters from "./PayListFilters";
import AlertModal from "../../components/AlertModal";
import { useAuthRedirect } from "../../hooks/auth/useAuthRedirect";

function PayList() {
  useAuthRedirect();

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    tempData,
    payListStatus,
    checkedItems,
    checkedAll,
    handleCheck,
    handleCheckedAll,
    handleUpdate,
    setInitial,
    handleSave,
    handleDelete,
    handleCopy,
    changeSelectedCards,
    expense,
    realExpense,
    alert,
    setAlert,
    setFocusedItemId,
  } = usePayList();

  const columns = {
    "": "checkbox",
    date: "날짜",
    cat_id: "분류",
    content: "항목",
    price1: "지출금액",
    price2: "실지출금액",
    card_id: "결제수단",
    remark: "비고",
  };

  const colWidths = ["5%", "10%", "10%", "auto", "12%", "12%", "15%", "15%"];

  return (
    <div className="payList_contents">
      <PayListFilters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <TableWrapper
        columns={columns}
        colWidths={colWidths}
        data={tempData}
        status={payListStatus}
        checkedItems={checkedItems}
        checkedAll={checkedAll}
        handleUpdate={handleUpdate}
        setInitial={setInitial}
        handleCheckedAll={handleCheckedAll}
        handleCheck={handleCheck}
        setFocusedItemId={setFocusedItemId}
      />

      <div className="summary-group">
        <ButtonGroup
          checkedItems={checkedItems}
          handleDelete={handleDelete}
          handleCopy={handleCopy}
          changeSelectedCards={changeSelectedCards}
        />
        <SummaryInfo expense={expense} realExpense={realExpense} />
        <SaveButtonWrapper onSave={handleSave} />
      </div>

      {alert.visible && (
        <AlertModal
          message={alert.message}
          onClose={() => setAlert({ message: "", visible: false })}
        />
      )}
    </div>
  );
}

export default PayList;
