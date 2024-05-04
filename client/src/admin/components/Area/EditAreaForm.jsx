import { useState } from "react";

function EditAreaForm({ onSave, onClose, defaultValues }) {
  const [areaName, setAreaName] = useState(defaultValues.areaName);
  const [description, setDescription] = useState(defaultValues.description);
  const [address, setAddress] = useState(defaultValues.address);
  const [focalPerson, setFocalPerson] = useState(defaultValues.focalPerson);
  const [contact, setContact] = useState(defaultValues.contact);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ areaName, description, address, focalPerson, contact });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Area Name:
        </label>
        <input
          type="text"
          id="name"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24 resize-none" // Adjust height as needed
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="focalPerson" className="text-sm font-medium">
          Focal Person:
        </label>
        <input
          type="text"
          id="focalPerson"
          value={focalPerson}
          onChange={(e) => setFocalPerson(e.target.value)}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="contact" className="text-sm font-medium">
          Contact:
        </label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md focus:outline-none hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditAreaForm;
