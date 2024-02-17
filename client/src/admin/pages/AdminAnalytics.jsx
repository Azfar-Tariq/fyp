/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Axios from "axios";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import Chart from "react-apexcharts";

export default function Analytics() {
  const [buildingList, setBuildingList] = useState([]);
  const [labList, setLabList] = useState([]);
  const [pcList, setPcList] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState("");
  const [selectedLabName, setSelectedLabName] = useState("");
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
    Axios.get("http://localhost:3001/readBuilding")
      .then((res) => {
        setBuildingList(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get buildings:", err);
        setLoading(false);
      });
  }, []);

  const fetchLabData = (buildingId, buildingName) => {
    Axios.get(`http://localhost:3001/readBuilding/${buildingId}/readLab`)
      .then((res) => {
        setLabList(res.data);
        setSelectedBuildingId(buildingId);
        setSelectedLabId(null);
        setSelectedBuildingName(buildingName);
        setSelectedLabName("");
      })
      .catch((err) => {
        console.error("Failed to get labs:", err);
      });
  };

  const fetchPcData = (labId, labName) => {
    Axios.get(
      `http://localhost:3001/readBuilding/${selectedBuildingId}/readLab/${labId}/readCoordinates`
    )
      .then((res) => {
        setPcList(res.data);
        setSelectedLabId(labId);
        setSelectedLabName(labName);
      })
      .catch((err) => {
        console.error("Failed to get PCs:", err);
      });
  };

  const handleBuildingClick = (buildingId, buildingName) => {
    if (buildingId === selectedBuildingId) {
      setSelectedBuildingId(null);
      setSelectedLabId(null);
      setSelectedLabName("");
      // setSelectedPcStatus("");
    } else {
      fetchLabData(buildingId, buildingName);
    }
  };

  const handleLabClick = (labId, labName) => {
    if (labId === selectedLabId) {
      setSelectedLabId(null);
    } else {
      fetchPcData(labId, labName);
    }
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen">
      <Header title="Analytics" />
      <div className="block sm:flex">
        <div className="flex flex-col w-72">
          {loading && (
            <div>
              <PulseLoader />
            </div>
          )}
          <ul>
            {buildingList.map((building, buildingIndex) => (
              <li key={buildingIndex} className="bg-gray-800 p-2">
                <a
                  className="flex items-center text-xl p-2 gap-4 text-white border border-gray-800 cursor-pointer hover:bg-gray-700 rounded-lg"
                  onClick={() =>
                    handleBuildingClick(building.id, building.buildingName)
                  }
                >
                  {building.id === selectedBuildingId ? (
                    <IcOutlineKeyboardArrowDown />
                  ) : (
                    <MaterialSymbolsArrowForwardIosRounded />
                  )}
                  <span>{building.buildingName}</span>
                </a>
                {building.id === selectedBuildingId && (
                  <ul className="ml-4">
                    {labList.map((lab, labIndex) => (
                      <li key={labIndex} className="p-2 ml-3">
                        <a
                          className="flex items-center text-xl p-2 gap-4 text-white border border-gray-800 cursor-pointer hover:bg-gray-700 rounded-lg"
                          onClick={() => handleLabClick(lab.id, lab.labName)}
                        >
                          <span>{lab.labName}</span>
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
          {selectedBuildingName && (
            <div>
              <strong>Selected Building: </strong> {selectedBuildingName}
            </div>
          )}
          {selectedLabName && (
            <div>
              <div>
                <strong>Selected Lab: </strong> {selectedLabName}
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
