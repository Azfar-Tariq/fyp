import { useState } from "react";

function AddAreaForm({ onSave }) {
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [focalPerson, setFocalPerson] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ areaName, description, address, focalPerson, contact });
    setAreaName("");
    setDescription("");
    setAddress("");
    setFocalPerson("");
    setContact("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 text-white"
    >
      <div className="flex flex-col space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Area Name:
        </label>
        <input
          type="text"
          id="name"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          className="rounded-md text-black p-2 focus:outline-none"
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
          className="rounded-md text-black p-2 focus:outline-none h-24 resize-none"
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
          className="rounded-md text-black p-2 focus:outline-none"
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
          className="rounded-md text-black p-2 focus:outline-none"
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
          className="rounded-md text-black p-2 focus:outline-none"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md focus:outline-none hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default AddAreaForm;
