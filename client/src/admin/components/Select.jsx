/* eslint-disable no-unused-vars */
import { useState } from "react";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { useEffect } from "react";
import Axios from "axios";
import { MaterialSymbolsAddRounded } from "../assets/icons/add";
import Add from "./Add";
import ModalOverlay from "./ModalOverlay";
import Dialog from "./Dialog";
import { toast } from "react-toastify";

export default function Select({
  selectedArea,
  selectedCamera,
  onAreaChange,
  onCameraChange,
}) {
  const [areas, setAreas] = useState([]);
  const [updatedAreas, setUpdatedAreas] = useState([]);
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

  const handleAreaSubmitDialog = () => {
    Axios.post("http://localhost:3001/insertArea", {
      areaName: areaName,
    })
      .then((response) => {
        console.log(response.data);
        toast.success("Building added successfully");
      })
      .catch((error) => {
        console.error("Failed to save building:", error);
      });
    setIsAreaDialogOpen(false);
    setIsCameraDialogOpen(false);
    setAreaName("");
  };

  const handleCameraSubmitDialog = () => {
    Axios.post(`http://localhost:3001/readArea/${selectedArea}/addCamera`, {
      cameraName: cameraName,
    })
      .then((response) => {
        console.log(response.data);
        toast.success("Lab added successfully");
      })
      .catch((err) => {
        console.error("Failed to save lab:", err);
      });
    setIsAreaDialogOpen(false);
    setIsCameraDialogOpen(false);
    setCameraName("");
  };

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

  const toggleCameraDialog = () => {
    setIsCameraDialogOpen(!isCameraDialogOpen);
  };

  const toggleAreaDialog = () => {
    setIsAreaDialogOpen(!isAreaDialogOpen);
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

  const deleteArea = (id) => {
    Axios.delete(`http://localhost:3001/deleteArea/${selectedArea}`)
      .then((res) => {
        console.log(res.data);
        updatedAreas();
        toast.success("Building deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openEditDialog = () => {
    // setEditAreaName(val.buildingName);
    setIsEditAreaDialogOpen(true);
  };

  const handleSubmitDialog = () => {
    Axios.put(`http://localhost:3001/updateArea/${selectedArea}`, {
      newAreaName: editAreaName,
    })
      .then((res) => {
        console.log(res.data);
        updatedAreas();
        toast.success("Building updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setIsEditAreaDialogOpen(false);
  };

  return (
    <div className="container mx-auto pt-12">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
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
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <div className="flex justify-between gap-2">
                <Add toggleDialog={toggleAreaDialog} text="Area" />
                {selectedArea && (
                  <div
                    className="p-2 mt-3 rounded-md text-center bg-blue-400"
                    onClick={openEditDialog}
                  >
                    Edit
                  </div>
                )}
                {isEditAreaDialogOpen && (
                  <ModalOverlay isOpen={isEditAreaDialogOpen}>
                    <Dialog
                      text="Edit Area"
                      text2="Area"
                      name={editAreaName}
                      setName={setEditAreaName}
                      onClose={() => setIsEditAreaDialogOpen(false)}
                      onSubmit={handleSubmitDialog}
                    />
                  </ModalOverlay>
                )}
                {selectedArea && (
                  <div
                    className="p-2 mt-3 rounded-md text-center bg-red-400"
                    onClick={deleteArea}
                  >
                    Delete
                  </div>
                )}
                {isAreaDialogOpen && (
                  <ModalOverlay isOpen={isAreaDialogOpen}>
                    <Dialog
                      text="Add Area"
                      text2="Area"
                      name={areaName}
                      setName={setAreaName}
                      onClose={toggleAreaDialog}
                      onSubmit={handleAreaSubmitDialog}
                    />
                  </ModalOverlay>
                )}
              </div>
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
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <div className="flex justify-between gap-2">
                  <Add toggleDialog={toggleAreaDialog} text="Area" />
                  {selectedArea && (
                    <div
                      className="p-2 mt-3 rounded-md text-center bg-blue-400"
                      onClick={openEditDialog}
                    >
                      Edit
                    </div>
                  )}
                  {isEditAreaDialogOpen && (
                    <ModalOverlay isOpen={isEditAreaDialogOpen}>
                      <Dialog
                        text="Edit Area"
                        text2="Area"
                        name={editAreaName}
                        setName={setEditAreaName}
                        onClose={() => setIsEditAreaDialogOpen(false)}
                        onSubmit={handleSubmitDialog}
                      />
                    </ModalOverlay>
                  )}
                  {selectedArea && (
                    <div
                      className="p-2 mt-3 rounded-md text-center bg-red-400"
                      onClick={deleteArea}
                    >
                      Delete
                    </div>
                  )}
                  {isAreaDialogOpen && (
                    <ModalOverlay isOpen={isAreaDialogOpen}>
                      <Dialog
                        text="Add Area"
                        text2="Area"
                        name={areaName}
                        setName={setAreaName}
                        onClose={toggleAreaDialog}
                        onSubmit={handleAreaSubmitDialog}
                      />
                    </ModalOverlay>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
