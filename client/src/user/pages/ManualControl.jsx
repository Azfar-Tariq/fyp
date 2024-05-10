/* eslint-disable no-unused-vars */
import Table from "../components/Manual_Request/Table";
import Select from "../components/Manual_Request/Select";
import { useEffect, useState } from "react";
// import { UilSave } from "../assets/icons/save";
import Axios from "axios";
import ImageAnnotator from "../components/Manual_Request/ImageAnnotator";

const placeholderImage = "https://via.placeholder.com/600x350";

export default function Configuration() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [selectedRectangle, setSelectedRectangle] = useState(null);

  const email = localStorage.getItem("email");
  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
  };
  const handleCameraChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const handleSelectedRectangleChange = (rectangleId) => {
    setSelectedRectangle(rectangleId);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };


  const handleManualControlRequest = () => {
    setLoading(true);
    Axios.post("http://localhost:3001/request-manual-control", { email, selectedArea })
      .then((response) => {
        console.log(response.data);
        // Handle success, e.g., show a success message
      })
      .catch((error) => {
        console.error("Error sending manual control request:", error);
        // Handle error, e.g., show an error message
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedCamera) {
      setLoading(true);
      Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
      )
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to get data:", error);
          setLoading(false);
        });
    }
  }, [selectedCamera]);

  return (
    <div className="bg-primary py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="flex gap-8">
          <div>
            {selectedCamera ? (
              <div>
                <ImageAnnotator
                  selectedRectangle={selectedRectangle}
                  selectedCamera={selectedCamera}
                />
              </div>
            ) : (
              <img src={placeholderImage} className="rounded-md" />
            )}
          </div>
          <div>
            <Select
              selectedArea={selectedArea}
              selectedCamera={selectedCamera}
              onAreaChange={handleAreaChange}
              onCameraChange={handleCameraChange}
            />
          </div>
        </div>
      </div>
      {selectedCamera && (
        <div className="mt-4">
          <Table
            key={tableKey}
            selectedCamera={selectedCamera}
            onSelectedRectangleChange={handleSelectedRectangleChange}
            onDeleteRectangle={fetchData}
          />
        </div>
      )}
      <button
      onClick={handleManualControlRequest}
      className={`flex gap-2 bg-background text-white py-2 px-3 rounded-full hover:bg-icon hover:text-black transition duration-150 ease-in-out focus:outline-none ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
      disabled={loading}
    >
      Send Request
    </button>
    </div>
  );
}
