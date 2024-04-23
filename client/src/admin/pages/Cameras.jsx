import { useState, useEffect } from "react";
import Axios from "axios";

const Cameras = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch areas from the server
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  const handleAddCamera = () => {
    if (!selectedArea || !cameraName || !description) {
      setError("Please fill out all fields");
      return;
    }

    // Send camera data to the server
    Axios.post(`http://localhost:3001/readArea/${selectedArea}/addCamera`, {
      cameraName,
      description,
    })
      .then((response) => {
        // Clear input fields and error message on success
        setCameraName("");
        setDescription("");
        setError(null);
        // Optionally, you can show a success message or update the UI
      })
      .catch((error) => {
        console.error("Error adding camera:", error);
        setError("Failed to add camera. Please try again later.");
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Add New Camera</h1>
      <div className="flex flex-col gap-4 max-w-md">
        {error && <div className="text-red-500">{error}</div>}
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Area</option>
          {areas.map((area) => (
            <option key={area.AreaID} value={area.AreaID}>
              {area.AreaName}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={cameraName}
          onChange={(e) => setCameraName(e.target.value)}
          placeholder="Camera Name"
          className="border rounded px-4 py-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Camera Description"
          className="border rounded px-4 py-2"
        ></textarea>
        <button
          onClick={handleAddCamera}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        >
          Add Camera
        </button>
      </div>
    </div>
  );
};

export default Cameras;
