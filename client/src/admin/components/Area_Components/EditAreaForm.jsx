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
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">areaName:</label>
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
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
}

export default EditAreaForm;