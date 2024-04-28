/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Axios from "axios";
import Add from "./Add";
import ModalOverlay from "./ModalOverlay";
import Dialog from "./Dialog";
import { ToastContainer, toast } from "react-toastify";
import { MaterialSymbolsDelete } from "../assets/icons/delete";
import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";

export default function Select({
  selectedArea,
  selectedCamera,
  onAreaChange,
  onCameraChange,
}) {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [showCameras, setShowCameras] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [isEditAreaDialogOpen, setIsEditAreaDialogOpen] = useState(false);
  const [editAreaName, setEditAreaName] = useState("");
  const [isEditCameraDialogOpen, setIsEditCameraDialogOpen] = useState(false);
  const [editCameraName, setEditCameraName] = useState("");

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

  const fetchCameras = (selectedArea) => {
    Axios.get(`http://localhost:3001/readArea/${selectedArea}/readCamera`)
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
    setShowCameras(true);
  };

  const handleCameraClick = (cameraId) => {
    onCameraChange(cameraId);
  };

  return (
    <div className="container mx-auto pt-12">
      <ToastContainer />
      <div className="max-w-md mx-auto bg-purple-50 border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
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
                  className="text-gray-700 font-semibold mb-2 block"
                >
                  Select Camera:
                </label>
                <select
                  id="camera"
                  className="w-full py-2 px-3 bg-purple-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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
