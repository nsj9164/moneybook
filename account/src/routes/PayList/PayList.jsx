import "react-datepicker/dist/react-datepicker.css";
import TableWrapper from "@/components/Table/TableWrapper";
import ButtonGroup from "./Summary/ButtonGroup";
import SummaryInfo from "./Summary/SummaryInfo";
import SaveButtonWrapper from "./Summary/SaveButtonWrapper";
import PayListFilters from "./PayListFilters";
import AlertModal from "@/components/AlertModal";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";
import { usePayList } from "@/hooks/payList/usePayList";
import PayListChart from "./PayListChart";
import { useChartData } from "@/hooks/payList/useChartData";
import useFetchLists from "@/hooks/data/useFetchLists";
import { useState } from "react";

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

  const {
    lists: { categoryList },
    statuses: { categoryListStatus },
  } = useFetchLists(["categoryList"]);
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const { chartData, chartLabels } = useChartData(
    tempData,
    categoryList,
    "price1",
    showOnlyUsed
  );

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

      <PayListChart
        chartData={chartData}
        chartLabels={chartLabels}
        showOnlyUsed={showOnlyUsed}
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
