/* eslint-disable no-unused-vars */
import Table from "../components/Table";
import Select from "../components/Select";
import { useState } from "react";

export default function Configuration() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const handleSelectedArea = (areaId) => {
    setSelectedArea(areaId);
    console.log(areaId);
  };
  const handleSelectedCamera = (cameraId) => {
    setSelectedCamera(cameraId);
    console.log(cameraId);
  };

  return (
    <div className="py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            Configuration
            {selectedCamera && (
              <img src="https://dummyimage.com/500x500" alt="" />
            )}
          </div>
          <div className="col-span-1">
            <Select
              setSelectedArea={handleSelectedArea}
              setSelectedCamera={handleSelectedCamera}
            />
          </div>
        </div>
      </div>
      {selectedCamera && (
        <div className="mt-4">
          <Table selectedArea={selectedArea} selectedCamera={selectedCamera} />
        </div>
      )}
    </div>
  );
}
