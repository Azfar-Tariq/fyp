import React, { useState, useEffect } from "react";
import Axios from "axios";
import { UilSave } from "../../assets/icons/save";
import { MaterialSymbolsBackspaceRounded } from "../../assets/icons/clear";

const EditModel = ({ isOpen, onClose, selectedCamera, onSave }) => {
  const [cameraName, setCameraName] = useState(
    selectedCamera?.CameraName || ""
  );
  const [cameraDescription, setCameraDescription] = useState(
    selectedCamera?.CameraDescription || ""
  );
  // console.log("Selected Camera in Edit mODEL IS ",selectedCamera)
  const handleSave = () => {
    const updatedCamera = {
      CameraName: cameraName,
      CameraDescription: cameraDescription,
    };

    // Call the API to update the camera
    Axios.put(
      `http://localhost:3001/updateCamera/${selectedCamera}`,
      updatedCamera
    )
      .then((response) => {
        onSave(updatedCamera); // Notify parent component about the updated camera
        onClose(); // Close the modal after saving
      })
      .catch((error) => {
        console.error("Failed to update camera:", error);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-background text-white rounded-lg p-4">
        <h2 className="text-lg font-bold mb-2">Edit Camera</h2>
        <form>
          <label className="block mb-2">
            Camera Name:
            <input
              type="text"
              value={cameraName}
              onChange={(event) => setCameraName(event.target.value)}
              className="block w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <label className="block mb-2">
            Camera Description:
            <textarea
              value={cameraDescription}
              onChange={(event) => setCameraDescription(event.target.value)}
              className="block w-full p-2 pl-10 text-sm text-gray-700"
            />
          </label>
          <div className="flex justify-center items-center gap-2">
            <button
              className="flex p-2 gap-2 rounded bg-background text-white hover:bg-icon hover:text-black duration-150"
              onClick={handleSave}
            >
              <UilSave />
              Save
            </button>
            <button
              className="bg-background text-white flex p-2 gap-2 rounded hover:bg-icon hover:text-black duration-150"
              onClick={onClose}
            >
              <MaterialSymbolsBackspaceRounded />
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModel;
