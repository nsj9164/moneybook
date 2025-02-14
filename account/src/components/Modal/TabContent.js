import React, { useEffect, useState } from "react";
import AlertModal from "../common/AlertModal";

const TabContent = React.memo(({ component }) => {
  return <>{component}</>;
});

export default TabContent;
