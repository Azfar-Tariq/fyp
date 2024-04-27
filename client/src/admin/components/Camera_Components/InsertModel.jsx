import React, { useState, useEffect } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { fetchData } from "../../pages/Cameras"; // Import the fetchData function

const InsertModel = ({ isOpen, onClose }) => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [cameraDescription, setCameraDescription] = useState("");

  useEffect(() => {
    // Fetch areas data when the component mounts
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
        // console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  const handleSave = () => {
    if (selectedArea === "") {
      alert("Please select an area to add a new camera.");
      return;
    }
      const newCamera = {
      areaId: selectedArea,
      cameraName: cameraName,
      description: cameraDescription,
    };
  
    // console.log(selectedArea);

    // Call the API to add a new camera
    Axios.post("http://localhost:3001/insertCamera", newCamera)
      .then((response) => {
        console.log("Camera saved to database");
        // Add the new camera to the data array
        // const newData = [...data, response.data];
        // setData(newData);

        // Close the modal after saving
        onClose(); 
        toast.success("New Camera Added Successfully");
        // Fetch updated data from the server
        // fetchData(newData);
      })
      .catch((error) => {
        console.error("Failed to save camera to the database:", error);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-4">
      <ToastContainer />
        <h2 className="text-lg font-bold mb-2">Add Camera</h2>
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
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default InsertModel;
