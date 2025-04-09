import React from "react";

const TabContent = React.memo(({ component }) => {
  return <>{component}</>;
});

export default TabContent;
