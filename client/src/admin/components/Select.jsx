/* eslint-disable no-unused-vars */
import { useState } from "react";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { useEffect } from "react";
import Axios from "axios";

export default function Select({
  selectedArea,
  selectedCamera,
  onAreaChange,
  onCameraChange,
}) {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Failed to get areas:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedArea) {
      Axios.get(`http://localhost:3001/readArea/${selectedArea}/readCamera`)
        .then((response) => {
          setCameras(response.data);
        })
        .catch((error) => {
          console.error("Failed to get cameras:", error);
        });
    }
  }, [selectedArea]);

  const handleAreaClick = (areaId) => {
    onAreaChange(areaId);
  };

  const handleCameraClick = (cameraId) => {
    onCameraChange(cameraId);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Areas</h2>
      <ul>
        {areas.map((area) => (
          <div key={area.areaId}>
            <div
              className="flex cursor-pointer"
              onClick={() => handleAreaClick(area.areaId)}
            >
              <IcOutlineKeyboardArrowDown />
              <li>{area.areaName}</li>
            </div>
            {selectedArea === area.areaId && (
              <ul className="pl-4">
                {cameras.map((camera) => (
                  <div key={camera.CameraID}>
                    <div
                      className="flex cursor-pointer"
                      onClick={() => handleCameraClick(camera.CameraID)}
                    >
                      <IcOutlineKeyboardArrowDown />
                      <li className="font-semibold">{camera.CameraName}</li>
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
