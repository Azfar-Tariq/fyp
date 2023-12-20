/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import LabCard from "./LabCard";
import Pcs from "./Pcs";
import Axios from "axios";
import { PulseLoader } from "react-spinners";

const fetchLabData = async (parentBuildingId, setLabData) => {
  try {
    const response = await Axios.get(
      `http://localhost:3001/readBuilding/${parentBuildingId}/readLab`
    );
    setLabData(response.data);
  } catch (err) {
    console.error("Failed to get lab data:", err);
  }
};

export default function Labs({
  parentBuildingId,
  parentBuildingName,
  backToBuildings,
}) {
  const [labData, setLabData] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedLabName, setSelectedLabName] = useState("");
  const [loading, setLoading] = useState(false);

  const updatedLabData = () => {
    fetchLabData(parentBuildingId, setLabData);
  };

  useEffect(() => {
    setLoading(true);
    Axios.get(`http://localhost:3001/readBuilding/${parentBuildingId}/readLab`)
      .then((response) => {
        setLabData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to get labs:", error);
        setLoading(false);
      });
  }, [parentBuildingId]);

  const handleSelectLab = (labId, labName) => {
    setSelectedLabId(labId);
    setSelectedLabName(labName);
  };

  const handleBackToLabs = () => {
    setSelectedLabId(null);
    setSelectedLabName("");
  };

  return (
    <div>
      {selectedLabId === null ? (
        <div>
          <div className="flex">
            <p
              className="text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 pl-2 pr-2 rounded-lg font-semibold mb-2 cursor-pointer"
              onClick={backToBuildings}
            >
              {parentBuildingName}
            </p>
          </div>
          {loading && (
            <div>
              <PulseLoader />
            </div>
          )}
          {labData.length === 0 ? (
            <div>
              <p>No Labs currently</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {labData.map((val, index) => (
                <div key={index} className="relative">
                  <LabCard
                    val={val}
                    parentBuildingId={parentBuildingId}
                    updatedLabData={updatedLabData}
                    onSelect={() => handleSelectLab(val.id, val.labName)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Pcs
            parentBuildingId={parentBuildingId}
            parentBuildingName={parentBuildingName}
            parentLabId={selectedLabId}
            parentLabName={selectedLabName}
            backToLabs={handleBackToLabs}
            backToBuildings={backToBuildings}
          />
        </div>
      )}
    </div>
  );
}
