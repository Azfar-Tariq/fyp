import React, { useState } from "react";

const AreaForm = ({ onSave, initialValues }) => {
  const [formFields, setFormFields] = useState(initialValues);

  const handleInputChange = (e, index) => {
    const newValues = [...formFields];
    newValues[index][e.target.name] = e.target.value;
    setFormFields(newValues);
  };

  const handleAddField = () => {
    setFormFields([...formFields, { name: "", description: "", address: "", focalPerson: "", contact: "" }]);
  };

  const handleRemoveField = (index) => {
    const newValues = [...formFields];
    newValues.splice(index, 1);
    setFormFields(newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formFields);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((obj, index) => (
        <div key={index}>
          <input
            name="name"
            placeholder="Name"
            value={obj.name}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            name="description"
            placeholder="Description"
            value={obj.description}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            name="address"
            placeholder="Address"
            value={obj.address}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            name="focalPerson"
            placeholder="Focal Person"
            value={obj.focalPerson}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            name="contact"
            placeholder="Contact"
            value={obj.contact}
            onChange={(e) => handleInputChange(e, index)}
          />
          <button type="button" onClick={() => handleRemoveField(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddField}>
        Add
      </button>
      <button type="submit">Save</button>
    </form>
  );
};

export default AreaForm;