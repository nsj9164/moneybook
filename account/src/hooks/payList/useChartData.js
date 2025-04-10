import { unformatNumber } from "@/util/util";
import { useMemo } from "react";

export const useChartData = (tempData, categoryList) => {
  return useMemo(() => {
    if (!categoryList) return { charData: [], chartLabels: [] };

    const map = {};
    categoryList.forEach((cat) => {
      map[cat.id] = cat.categoryNm;
    });

    const sums = {};
    tempData.forEach((item) => {
      if (item.cat_id && item.price1) {
        const price = parseInt(unformatNumber(item.price1));
        sums[item.cat_id] = (sums[item.cat_id] || 0) + price;
      }
    });

    const labels = [];
    const data = [];
    Object.keys(sums).forEach((id) => {
      labels.push(map[id] || "미분류");
      data.push(sums[id]);
    });

    return { chartData: data, chartLabels: labels };
  }, [tempData, categoryList]);
};
