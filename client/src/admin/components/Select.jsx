/* eslint-disable no-unused-vars */
import { useState } from "react";
import { nodes } from "../data";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";

export default function Select({ setSelectedArea, setSelectedCamera }) {
  const [selectedArea, setSelectedAreaLocal] = useState(null);
  const [selectedCamera, setSelectedCameraLocal] = useState(null);

  const handleAreaClick = (areaId) => {
    if (areaId !== selectedArea) {
      setSelectedArea(areaId === selectedArea ? null : areaId);
      setSelectedAreaLocal(areaId === selectedArea ? null : areaId);
    }
  };

  const handleCameraClick = (cameraId) => {
    if (cameraId !== selectedCamera) {
      setSelectedCamera(cameraId === selectedCamera ? null : cameraId);
      setSelectedCameraLocal(cameraId === selectedCamera ? null : cameraId);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Areas</h2>
      <ul>
        {nodes.map((area) => (
          <div key={area.areaId}>
            <div
              className="flex cursor-pointer"
              onClick={() => handleAreaClick(area.areaId)}
            >
              <IcOutlineKeyboardArrowDown />
              <li
                className={`${
                  selectedArea === area.areaId ? "font-semibold" : ""
                }`}
              >
                {area.areaName}
              </li>
            </div>
            {selectedArea === area.areaId && (
              <ul className="pl-4">
                {area.cameras.map((camera) => (
                  <div key={camera.cameraId}>
                    <div
                      className="flex cursor-pointer"
                      onClick={() => handleCameraClick(camera.cameraId)}
                    >
                      <IcOutlineKeyboardArrowDown />
                      <li className="font-semibold">{camera.cameraName}</li>
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
