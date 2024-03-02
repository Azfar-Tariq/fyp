/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
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
        console.log(res.data);
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
      `http://localhost:3001/readArea/${selectedAreaId}/readCamera/${cameraId}/BoundedRectangles`
    )
      .then((res) => {
        setBoundedRectangleList(res.data);
        setSelectedCameraId(cameraId);
        setSelectedCameraName(cameraName);
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
      console.log("Selected camera Id: " + cameraId);
    }
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen">
      <div className="block sm:flex">
        <div className="flex flex-col w-72">
          {loading && (
            <div>
              <PulseLoader />
            </div>
          )}
          <ul>
            {areaList.map((area, areaIndex) => (
  <li key={areaIndex} className="bg-gray-800 p-2">
    {/* {console.log(area)} */}
    <a
      className="flex items-center text-xl p-2 gap-4 text-white border border-gray-800 cursor-pointer hover:bg-gray-700 rounded-lg"
      onClick={() => {
        handleAreaClick(area.areaId, area.areaName);
      }}
                >
                  {area.areaId === selectedAreaId ? (
                    <IcOutlineKeyboardArrowDown />
                  ) : (
                    <MaterialSymbolsArrowForwardIosRounded />
                  )}
                  <span>{area.areaName}
                  {console.log("Selected area ID in with selectedareaid return: "+ selectedAreaId + ' ID in return'+area.areaId)}
                  {/* {console.log("Selected area ID in return: ", )} */}
                  </span>
                </a>
                {area.id === selectedAreaId && (
                  <ul className="ml-4">
                    {cameraList.map((camera, cameraIndex) => (
                      <li key={cameraIndex} className="p-2 ml-3">
                        <a
                          className="flex items-center text-xl p-2 gap-4 text-white border border-gray-800 cursor-pointer hover:bg-gray-700 rounded-lg"
                          onClick={() => handleCameraClick(camera.cameraId, camera.cameraName)}
                        >
                          <span>{camera.cameraName}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
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
              <div className="overflow-x-auto">
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="bar"
                  width={500}
                  height={320}
                />
              </div>
              <div>
                <p className="font-semibold text-lg">Statistics:</p>
                <p className="font-normal text-sm">Highest Usage is at 11:00</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
