import { useChartData } from "@/hooks/payList/useChartData";
import { useState } from "react";
import Chart from "react-apexcharts";

function PayListChart({ chartData, chartLabels, showOnlyUsed }) {
  const colors = [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#3F51B5",
    "#546E7A",
    "#D4526E",
  ];

  const series = [{ data: chartData || [] }];

  const options = {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {},
      },
    },
    colors: chartData.map((value) => (value === 0 ? "#e0e0e0" : "#00E396")),
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: chartLabels || [],
      labels: {
        rotate: 0,
        style: {
          fontSize: "12px",
        },
        formatter: (val) => (val.length > 10 ? val.slice(0, 10) + "…" : val),
      },
    },
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showOnlyUsed}
            onChange={() => setShowOnlyUsed(!showOnlyUsed)}
          />
          사용된 카테고리만 보기
        </label>
      </div>

      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height={300}
      />
    </div>
  );
}

export default PayListChart;
