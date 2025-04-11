import { unformatNumber } from "@/util/util";
import { useMemo } from "react";

export const useChartData = (
  tempData,
  categoryList,
  priceKey = "price1",
  onlyUsed = false
) => {
  return useMemo(() => {
    if (!categoryList || !Array.isArray(categoryList))
      return { chartData: [], chartLabels: [] };

    const map = {};
    categoryList.forEach((cat) => {
      map[cat.cat_id] = cat.category_nm;
    });

    const sums = {};
    tempData
      .filter((item) => !item.isDisabled && item.cat_id && item[priceKey])
      .forEach((item) => {
        const price = parseInt(unformatNumber(item[priceKey]));
        sums[item.cat_id] = (sums[item.cat_id] || 0) + price;
      });

    const filteredCategories = onlyUsed
      ? categoryList.filter((cat) => sums[cat.cat_id])
      : categoryList;

    const chartLabels = filteredCategories.map((cat) => cat.category_nm);
    const chartData = filteredCategories.map((cat) => sums[cat.cat_id] || 0);

    return { chartData, chartLabels };
  }, [tempData, categoryList, priceKey, onlyUsed]);
};
