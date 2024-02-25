import { useEffect, useState } from "react";
import AreaCard from "../components/AreaCard";
import Header from "../components/Header";
import Axios from "axios";
import Camera from "../components/Camera";
import { ToastContainer, toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

const fetchData = async (setAreaList) => {
  try {
    const response = await Axios.get("http://localhost:3001/readArea");
    setAreaList(response.data);
  } catch (err) {
    console.error("Failed to get areas:", err);
  }
};

export default function Area() {
  const [areaList, setAreaList] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [loading, setLoading] = useState(false);

  const updatedAreaData = () => {
    fetchData(setAreaList);
  };

  useEffect(() => {
    setLoading(true);
    fetchData(setAreaList).then(() => setLoading(false));
  }, []);

  const handleSelectArea = (areaId, areaName) => {
    setSelectedAreaId(areaId);
    setSelectedAreaName(areaName);
  };

  const handleBackToAreas = () => {
    setSelectedAreaId(null);
    setSelectedAreaName("");
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen block sm:flex flex-col">
      <Header title="Dashboard" />
      <ToastContainer className="w-11/12 m-4 sm:block sm:w-80 sm:m-0" />
      <div className="overflow-y-auto">
        {selectedAreaId === null ? (
          <div>
            {loading && (
              <div>
                <PulseLoader />
              </div>
            )}
            {areaList.length === 0 ? (
              <p>No Areas currently</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {areaList.map((val, index) => (
                  <div key={index} className="relative">
                    <AreaCard
                      val={val}
                      updatedAreaData={updatedAreaData}
                      showDescriptionField={true}
                      onSelect={() => {
                        handleSelectArea(val.areaId, val.areaName);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Camera
              parentAreaId={selectedAreaId}
              parentAreaName={selectedAreaName}
              backToAreas={handleBackToAreas}
            />
          </div>
        )}
      </div>
    </div>
  );
}
