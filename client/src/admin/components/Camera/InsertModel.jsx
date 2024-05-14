import React, { useState, useEffect } from "react";
import Axios from "axios";

const EditModel = ({ isOpen, onClose, selectedCamera, onSave }) => {
  const [cameraName, setCameraName] = useState("");
  const [cameraDescription, setCameraDescription] = useState("");

  useEffect(() => {
    if (selectedCamera) {
      setCameraName(selectedCamera.CameraName);
      setCameraDescription(selectedCamera.CameraDescription);
    }
  }, [selectedCamera]);

  const handleSave = () => {
    const updatedCamera = {
      CameraName: cameraName,
      CameraDescription: cameraDescription,
    };

    Axios.put(
      `http://localhost:3001/updateCamera/${selectedCamera.CameraID}`,
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
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-bold mb-2">Edit Camera</h2>
        <form>
          <label className="block mb-2 text-sm">
            Camera Name:
            <input
              type="text"
              value={cameraName}
              onChange={(event) => setCameraName(event.target.value)}
              className="block w-full p-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="block mb-2 text-sm">
            Camera Description:
            <textarea
              value={cameraDescription}
              onChange={(event) => setCameraDescription(event.target.value)}
              className="block w-full p-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </label>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:ring focus:ring-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModel;
