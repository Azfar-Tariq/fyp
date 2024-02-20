import { useState } from "react";
import { nodes } from "../data";

export default function Select() {
  const [selectedArea, setSelectedArea] = useState(null);

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="area">Select Area</label>
      <select
        id="area"
        name="area"
        className="border border-gray-300 rounded-md"
        onChange={handleAreaChange}
        value={selectedArea}
      >
        <option value="">All Areas</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.areaName}>
            {node.areaName}
          </option>
        ))}
      </select>

      {selectedArea && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{selectedArea}</h2>
          <ul className="list-disc pl-4">
            {nodes
              .filter((node) => node.areaName === selectedArea)
              .map((node) => (
                <li key={node.id}>{node.cameraName}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
