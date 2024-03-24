import Chart from "react-apexcharts";

export default function PieChart({ data }) {
  const chartData = {
    series: data,
    options: {
      labels: [
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ],
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        width="370"
      />
    </div>
  );
}
