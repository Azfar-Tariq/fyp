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
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={areaName}
        onChange={(e) => setAreaName(e.target.value)}
      />
      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <label htmlFor="focalPerson">Focal Person:</label>
      <input
        type="text"
        id="focalPerson"
        value={focalPerson}
        onChange={(e) => setFocalPerson(e.target.value)}
      />
      <label htmlFor="contact">Contact:</label>
      <input
        type="text"
        id="contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default AddAreaForm;