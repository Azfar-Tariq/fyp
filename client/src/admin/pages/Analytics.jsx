import { useEffect, useState } from "react";
import Axios from "axios";
import AnalyticsCard from "../components/Analytics/AnalyticsCard";
import { getAreaData } from "../components/Analytics/AnalyticsData";
import PieChart from "../components/Analytics/PieChart";
import Chart from "react-apexcharts";

export default function Analytics() {
  const [areaList, setAreaList] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxUsageTime, setMaxUsageTime] = useState("");

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
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
      },
    },
    series: [
      {
        name: "Usage",
        data: [80, 120, 100, 150, 90, 110, 70, 100, 130],
      },
    ],
  });

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/readArea")
      .then((res) => {
        setAreaList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get Areas:", err);
        setLoading(false);
      });
  }, []);

  const fetchAreaData = (areaId, areaName) => {
    Axios.get(`http://localhost:3001/readArea/${areaId}`)
      .then((res) => {
        console.log(res.data);
        setChartData({
          ...chartData,
          series: [
            {
              name: "Usage",
              data: getAreaData(res.data.areaId),
            },
          ],
        });
        const maxUsageIndex = getAreaData(res.data.areaId).indexOf(
          Math.max(...getAreaData(res.data.areaId))
        );
        setMaxUsageTime(chartData.options.xaxis.categories[maxUsageIndex]);
      })
      .catch((err) => {
        console.error("Failed to get Area Data:", err);
      });
  };

  const handleAreaClick = (areaId, areaName) => {
    if (areaId === selectedAreaId) {
      setSelectedAreaId(null);
      setSelectedAreaName("");
    } else {
      setSelectedAreaId(areaId);
      setSelectedAreaName(areaName);
      fetchAreaData(areaId, areaName);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {areaList.map((val, index) => (
          <div key={index} className="relative">
            <AnalyticsCard
              val={val}
              onClick={() => handleAreaClick(val.areaId, val.areaName)}
            />
          </div>
        ))}
      </div>

      {selectedAreaName && (
        <div className="mt-8">
          <strong>Selected Area: </strong> {selectedAreaName}
          <div className="mt-6 flex justify-between">
            <div>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width={420}
                height={320}
              />
            </div>
            <div>
              <PieChart data={chartData.series[0].data} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-lg">Statistics:</p>
            <p className="font-normal text-sm">
              Highest Usage is at {maxUsageTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
