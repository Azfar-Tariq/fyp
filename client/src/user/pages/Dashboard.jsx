/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import Labs from "../components/Labs";
import { ToastContainer } from "react-toastify";
import { PulseLoader } from "react-spinners";
import Axios from "axios";

const fetchData = async (setBuildingList) => {
  try {
    const response = await Axios.get("http://localhost:3001/readBuilding");
    setBuildingList(response.data);
  } catch (err) {
    console.error("Failed to get buildings:", err);
  }
};

export default function Dashboard() {
  const [buildingList, setBuildingList] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/readBuilding")
      .then((response) => {
        setBuildingList(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get buildings:", err);
        setLoading(false);
      });
  }, []);

  const handleSelectBuilding = (buildingId, buildingName) => {
    setSelectedBuildingId(buildingId);
    setSelectedBuildingName(buildingName);
  };

  const handleBackToBuildings = () => {
    setSelectedBuildingId(null);
    setSelectedBuildingName("");
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen block sm:flex flex-col">
      <Header title="Dashboard" />
      <ToastContainer className="w-11/12 m-4 sm:block sm:w-80 sm:m-0" />
      <div className="overflow-y-auto">
        {selectedBuildingId === null ? (
          <div>
            <div className="mb-2">
              <a className="text-lg font-semibold">Buildings</a>
            </div>
            {loading && (
              <div>
                <PulseLoader />
              </div>
            )}
            {buildingList.length === 0 ? (
              <p>No Buildings currently</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {buildingList.map((val, index) => (
                  <div key={index} className="relative">
                    <Card
                      val={val}
                      onSelect={() =>
                        handleSelectBuilding(val.id, val.buildingName)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Labs
              parentBuildingId={selectedBuildingId}
              parentBuildingName={selectedBuildingName}
              backToBuildings={handleBackToBuildings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
