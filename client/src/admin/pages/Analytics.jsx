/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
import { getCameraData } from "../components/Analytics/AnalyticsData";
import DashboardStatsGrid from "../components/Analytics/DashboardStatsGrid";
import PieChart from "../components/Analytics/PieChart";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import Chart from "react-apexcharts";

export default function Analytics() {
  const [areaList, setAreaList] = useState([]);
  const [cameraList, setCameraList] = useState([]);
  const [boundedRectangleList, setBoundedRectangleList] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCameraName, setSelectedCameraName] = useState("");
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
        // console.log(res.data);
        setLoading(false);
        // console.log("Selected Area ID in useeffwct= ", selectedAreaId);
      })
      .catch((err) => {
        console.error("Failed to get Areas:", err);
        setLoading(false);
      });
  }, []);

  const fetchCameraData = (areaId, areaName) => {
    Axios.get(`http://localhost:3001/readArea/${areaId}/readCamera`)
      .then((res) => {
        setCameraList(res.data);
        // console.log(res.data);
        setSelectedAreaId(areaId);
        setSelectedCameraId(null);
        setSelectedAreaName(areaName);
        setSelectedCameraName("");
        // console.log("Area ID = ", areaId)
        // console.log("Selected Area ID = ", selectedAreaId)
      })
      .catch((err) => {
        console.error("Failed to get Cameras:", err);
      });
  };

  const fetchPcData = (cameraId, cameraName) => {
    Axios.get(
      `http://localhost:3001/readCamera/${cameraId}/readBoundedRectangles`
    )
      .then((res) => {
        setBoundedRectangleList(res.data);
        console.log(cameraId);
        console.log(cameraName);
        setSelectedCameraId(cameraId);
        setSelectedCameraName(cameraName);
        console.log(res.data);
        setChartData({
          ...chartData,
          series: [
            {
              name: "Usage",
              data: getCameraData(cameraId),
            },
          ],
        });
        // Gets the usage data for the selected camera
        const usageData = getCameraData(cameraId);
        // Sets the chart data for the selected camera
        setChartData({
          ...chartData,
          series: [
            {
              name: "Usage",
              data: usageData,
            },
          ],
        });
        // Finds the index of the maximum usage
        const maxUsageIndex = usageData.indexOf(Math.max(...usageData));
        // Sets the time of the highest usage
        setMaxUsageTime(chartData.options.xaxis.categories[maxUsageIndex]);
      })
      .catch((err) => {
        console.error("Failed to get PCs:", err);
      });
  };

  const handleAreaClick = (areaId, areaName) => {
    if (areaId === selectedAreaId) {
      setSelectedAreaId(null);
      setSelectedCameraId(null);
      setSelectedCameraName("");

      // setSelectedPcStatus("");
    } else {
      fetchCameraData(areaId, areaName);
    }
  };

  const handleCameraClick = (cameraId, cameraName) => {
    if (cameraId === selectedCameraId) {
      setSelectedCameraId(null);
    } else {
      fetchPcData(cameraId, cameraName);
      // console.log("Selected camera Id: " + cameraId);
    }
  };

  return (
    <div>
      <DashboardStatsGrid className="mt-5" />
      <div className="col-span-4 px-6 py-4">
        <div className="block sm:flex">
          <div className="p-4 bg-purple-50 border border-gray-300 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Select an Area and Camera
            </h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="area"
                  className="text-gray-700 font-semibold mb-2 block"
                >
                  Select Area:
                </label>
                <select
                  id="area"
                  className="w-full py-2 px-3 bg-purple-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={selectedAreaId || ""}
                  onChange={(e) =>
                    handleAreaClick(
                      e.target.value,
                      e.target.options[e.target.selectedIndex].text
                    )
                  }
                >
                  <option value="">Select Area</option>
                  {areaList.map((area) => (
                    <option key={area.areaId} value={area.areaId}>
                      {area.areaName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAreaId && (
                <div>
                  <label
                    htmlFor="camera"
                    className="text-gray-700 font-semibold mb-2 block"
                  >
                    Select Camera:
                  </label>
                  <select
                    id="camera"
                    className="w-full py-2 px-3 bg-purple-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={selectedCameraId || ""}
                    onChange={(e) =>
                      handleCameraClick(
                        e.target.value,
                        e.target.options[e.target.selectedIndex].text
                      )
                    }
                  >
                    <option value="">Select Camera</option>
                    {cameraList.map((camera) => (
                      <option key={camera.CameraID} value={camera.CameraID}>
                        {camera.CameraName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            {selectedAreaName && (
              <div>
                <strong>Selected Area: </strong> {selectedAreaName}
              </div>
            )}
            {selectedCameraName && (
              <div>
                {console.log("Selected Camera Name: ", selectedCameraName)}
                <div>
                  <strong>Selected Camera: </strong> {selectedCameraName}
                </div>
                <div className="overflow-x-auto flex justify-around items-center mr-4">
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    width={420}
                    height={320}
                  />
                  <PieChart
                    className="w-1/4 h-1/4"
                    data={chartData.series[0].data}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">Statistics:</p>
                  <p className="font-normal text-sm">
                    Highest Usage is at {maxUsageTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
