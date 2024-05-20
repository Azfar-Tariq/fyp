import { useState, useEffect } from "react";
import Axios from "axios";

const EditAreaModal = ({ isOpen, onClose, onSave, area }) => {
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [focalPerson, setFocalPerson] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    if (area) {
      setAreaName(area.areaName);
      setDescription(area.description);
      setAddress(area.address);
      setFocalPerson(area.focalPerson);
      setContact(area.contact);
    }
  }, [area]);

  const handleSave = () => {
    const updatedArea = {
      areaName,
      description,
      address,
      focalPerson,
      contact,
    };

    Axios.put(`http://localhost:3001/updateArea/${area.areaId}`, updatedArea)
      .then((response) => {
        onSave(updatedArea);
        onClose();
      })
      .catch((error) => {
        console.error("Error updating area", error);
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-center mb-4">Edit Area</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Area Name
            </label>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Focal Person
            </label>
            <input
              type="text"
              value={focalPerson}
              onChange={(e) => setFocalPerson(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contact Number
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAreaModal;
