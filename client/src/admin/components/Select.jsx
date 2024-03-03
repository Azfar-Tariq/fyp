/* eslint-disable no-unused-vars */
import { useState } from "react";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { useEffect } from "react";
import Axios from "axios";

export default function Select({
  selectedArea = "",
  selectedCamera = "",
  onAreaChange,
  onCameraChange,
}) {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [showCameras, setShowCameras] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Failed to get areas:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedArea) {
      Axios.get(`http://localhost:3001/readArea/${selectedArea}/readCamera`)
        .then((response) => {
          setCameras(response.data);
        })
        .catch((error) => {
          console.error("Failed to get cameras:", error);
        });
    }
  }, [selectedArea]);

  const handleAreaClick = (areaId) => {
    if (selectedCamera) {
      onCameraChange("");
    }
    onAreaChange(areaId);
    setShowCameras(true);
  };

  const handleCameraClick = (cameraId) => {
    onCameraChange(cameraId);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Areas</h2>
      <select
        className="cursor-pointer"
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

      {selectedArea && (
        <div className="mt-2">
          <h2 className="text-lg font-semibold">Cameras</h2>
          <select
            className="cursor-pointer"
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
  );
}
