import React, { useEffect, useState } from "react";
import AlertModal from "../AlertModal";

const TabContent = React.memo(
  ({ status, saveStatus, data, setData, component, errorMessage }) => {
    if (status === "loading") return <div>Loading...</div>;

    if (status === "succeeded" || (saveStatus && saveStatus === "succeeded")) {
      return <>{component}</>;
    }

    if (status === "failed" || (saveStatus && saveStatus === "failed")) {
      return <div>{errorMessage}</div>;
    }

    return null;
  }
);

export default TabContent;
