import React, { useEffect, useState } from "react";
import AlertModal from "../AlertModal";

const TabContent = React.memo(
  ({ status, saveStatus, data, setData, component, errorMessage }) => {
    console.log("###############", status, saveStatus);
    const [showAlertModal, setShowAlertModal] = useState(false);

    useEffect(() => {
      if (saveStatus === "succeeded" && !showAlertModal) {
        setShowAlertModal(true);
        const timer = setTimeout(() => setShowAlertModal(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [saveStatus, showAlertModal]);

    if (status === "loading") return <div>Loading...</div>;

    if (status === "succeeded" || (saveStatus && saveStatus === "succeeded")) {
      return (
        <>
          {component}
          {showAlertModal && (
            <AlertModal
              message="저장에 성공했습니다!"
              onClose={() => setShowAlertModal(false)}
            />
          )}
        </>
      );
    }

    if (status === "failed" || (saveStatus && saveStatus === "failed")) {
      return <div>{errorMessage}</div>;
    }

    return null;
  }
);

export default TabContent;
