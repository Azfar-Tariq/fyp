import React, { useState, useEffect } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UilSave } from "../../assets/icons/save";
import { MaterialSymbolsBackspaceRounded } from "../../assets/icons/clear";

const EditModel = ({ isOpen, onClose, selectedCamera, onSave }) => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraDescription, setCameraDescription] = useState("");

  useEffect(() => {
    // Fetch areas data when the component mounts
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });

    if (selectedCamera) {
      // Fetch the selected camera's data when the component mounts or selectedCamera changes
      Axios.get(`http://localhost:3001/getCamera/${selectedCamera}`)
        .then((response) => {
          const camera = response.data;
          setSelectedArea(camera.areaId);
          setCameraName(camera.cameraName);
          setCameraDescription(camera.description);
        })
        .catch((error) => {
          console.error("Error fetching camera data:", error);
        });
    }
  }, [selectedCamera]);

  const handleSave = () => {
    if (selectedArea === "") {
      alert("Please select an area to update the camera.");
      return;
    }
    const updatedCamera = {
      areaId: selectedArea,
      cameraName: cameraName,
      description: cameraDescription,
    };

    // Call the onSave function passed as a prop to save the updated camera
    onSave(updatedCamera);

    // Close the modal after saving
    onClose();
    toast.success("Camera Updated Successfully");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-background text-white rounded-lg p-4">
        <ToastContainer />
        <h2 className="text-lg font-bold mb-2">Edit Camera</h2>
        <form>
          <label className="block mb-2">
            Area Name:
            <select
              value={selectedArea}
              onChange={(event) => setSelectedArea(event.target.value)}
              className="block w-full p-2 pl-10 text-sm text-gray-700"
            >
              <option value="" className="text-black">
                Select Area
              </option>
              {areas.map((area) => (
                <option key={area.areaId} value={area.areaId}>
                  {area.areaName}
                </option>
              ))}
            </select>
          </label>
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
              type="button"
              className="flex p-2 gap-2 rounded bg-background text-white hover:bg-icon hover:text-black duration-150"
              onClick={handleSave}
            >
              <UilSave />
              Save
            </button>
            <button
              type="button"
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
