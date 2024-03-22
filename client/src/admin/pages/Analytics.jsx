/* eslint-disable no-unused-vars */
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
    <div>
      <div className="col-span-4 px-6 py-4"> 
        <div className="block sm:flex">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {areaList.map((val, index) => (
                    <div key={index} className="relative">
                      <AnalyticsCard
                        val={val}
                        onClick={() => handleAreaClick(val.areaId, val.areaName)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          
          <div className="p-4">
            {selectedAreaName && (
              <div>
                <strong>Selected Area: </strong> {selectedAreaName}
                <div className="overflow-x-auto flex justify-around items-center mr-4">
                  <Chart options={chartData.options} series={chartData.series} type="bar" width={420} height={320} />
                  <PieChart className="w-1/4 h-1/4" data={chartData.series[0].data} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Statistics:</p>
                  <p className="font-normal text-sm">Highest Usage is at {maxUsageTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
            }  
