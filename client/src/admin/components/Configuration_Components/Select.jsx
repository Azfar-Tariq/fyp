import { useState, useEffect } from "react";
import Axios from "axios";
import { ToastContainer } from "react-toastify";

export default function Select({
  selectedArea,
  selectedCamera,
  onAreaChange,
  onCameraChange,
}) {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      fetchCameras(selectedArea);
    }
  }, [selectedArea]);

  const fetchAreas = () => {
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Failed to get areas:", error);
      });
  };

  const fetchCameras = (areaId) => {
    Axios.get(`http://localhost:3001/readArea/${areaId}/readCamera`)
      .then((response) => {
        setCameras(response.data);
      })
      .catch((error) => {
        console.error("Failed to get cameras:", error);
      });
  };

  const handleAreaClick = (areaId) => {
    if (selectedCamera) {
      onCameraChange("");
    }
    onAreaChange(areaId);
  };

  const handleCameraClick = (cameraId) => {
    onCameraChange(cameraId);
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <div className="max-w-md mx-auto bg-background rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl text-white font-semibold mb-4">
            Select an Area and Camera
          </h2>
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="area"
                className="text-text font-semibold mb-2 block"
              >
                Select Area:
              </label>
              <select
                id="area"
                className="w-full py-2 px-3 bg-primary text-white rounded-md focus:outline-none"
                value={selectedArea || ""}
                onChange={(e) => handleAreaClick(e.target.value)}
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area.areaId} value={area.areaId}>
                    {area.areaName}
                  </option>
                ))}
              </select>
            </div>
            {selectedArea && (
              <div>
                <label
                  htmlFor="camera"
                  className="text-text font-semibold mb-2 block"
                >
                  Select Camera:
                </label>
                <select
                  id="camera"
                  className="w-full py-2 px-3 bg-primary text-white rounded-md focus:outline-none"
                  value={selectedCamera || ""}
                  onChange={(e) => handleCameraClick(e.target.value)}
                >
                  <option value="">Select Camera</option>
                  {cameras.map((camera) => (
                    <option key={camera.CameraID} value={camera.CameraID}>
                      {camera.CameraName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
