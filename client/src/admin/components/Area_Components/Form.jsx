import React, { useState } from "react";

const Form = ({ onSubmit, initialValues = {}, buttonText }) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
    setValues(initialValues); // Reset form values after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="areaName"
        value={values.areaName || ""}
        onChange={handleChange}
        placeholder="Area Name"
        required
      />
      <input
        type="text"
        name="description"
        value={values.description || ""}
        onChange={handleChange}
        placeholder="Area Description"
        required
      />
      <input
        type="text"
        name="address"
        value={values.address || ""}
        onChange={handleChange}
        placeholder="Area Address"
        required
      />
      <input
        type="text"
        name="focalPerson"
        value={values.focalPerson || ""}
        onChange={handleChange}
        placeholder="Focal Person"
        required
      />
      <input
        type="text"
        name="contact"
        value={values.contact || ""}
        onChange={handleChange}
        placeholder="Contact Number"
        required
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default Form;
