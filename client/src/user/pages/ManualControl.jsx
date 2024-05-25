/* eslint-disable no-unused-vars */
import Table from "../components/Table";
import Select from "../components/Select";
import { useEffect, useState } from "react";
import Axios from "axios";
import ImageAnnotator from "../components/ImageAnnotator";

const placeholderImage = "https://via.placeholder.com/800x400";
const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;
const RASPBERRY_IP = import.meta.env.VITE_RASPBERRY_PI_IP;
const RASPBERRY_PORT = import.meta.env.VITE_RASPBERRY_PI_PORT;

export default function Configuration() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [imageData, setImageData] = useState(null);

  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
  };
  const handleCameraChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `${HOST_ADDRESS}/readCamera/${selectedCamera}/readBoundedRectangles`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCamera) {
      setLoading(true);
      Axios.get(
        `${HOST_ADDRESS}/readCamera/${selectedCamera}/readBoundedRectangles`
      )
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to get data:", error);
          setLoading(false);
        });
    }
  }, [selectedCamera]);

  return (
    <div className="bg-primary py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="flex gap-8">
          <div>
            {selectedCamera ? (
              <div>
                <ImageAnnotator
                  selectedRectangle={selectedRectangle}
                  selectedCamera={selectedCamera}
                  // onSave={handleImageAnnotatorSave}
                  // imageData={imageData}
                />
              </div>
            ) : (
              <div>
                <img src={placeholderImage} className="rounded-md" />
              </div>
            )}
          </div>
          <div>
            <Select
              selectedArea={selectedArea}
              selectedCamera={selectedCamera}
              onAreaChange={handleAreaChange}
              onCameraChange={handleCameraChange}
            />
          </div>
        </div>
      </div>
      {selectedCamera && (
        <div className="mt-4">
          <Table
            key={tableKey}
            selectedCamera={selectedCamera}
            // onSelectedRectangleChange={handleSelectedRectangleChange}
            // onDeleteRectangle={fetchData}
          />
        </div>
      )}
    </div>
  );
}
