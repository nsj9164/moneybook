import Chart from "react-apexcharts";

function PayListChart({ chartData, chartLabels }) {
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

  const series = [{ data: chartData }];

  const options = {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {},
      },
    },
    colors: colors,
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
      categories: chartLabels,
      labels: {
        style: {
          colors: colors,
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <div>
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
