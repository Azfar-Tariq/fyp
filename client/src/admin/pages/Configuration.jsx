/* eslint-disable no-unused-vars */
import Table from "../components/Configuration_Components/Table";
import Select from "../components/Configuration_Components/Select";
import { useEffect, useState } from "react";
import { UilSave } from "../assets/icons/save";
import Axios from "axios";
import ImageAnnotator from "../components/Configuration_Components/ImageAnnotator";

const placeholderImage = "https://via.placeholder.com/600x350";

export default function Configuration() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [data, setData] = useState([]);
  const [drawnRectangles, setDrawnRectangles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [selectedRectangle, setSelectedRectangle] = useState(null);

  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
  };
  const handleCameraChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const handleSelectedRectangleChange = (rectangleId) => {
    setSelectedRectangle(rectangleId);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
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
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
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

  const handleBoxCreated = async (boxCoordinates) => {
    setDrawnRectangles((prevCoordinates) => [
      ...prevCoordinates,
      boxCoordinates,
    ]);
  };

  const handleSaveButtonClick = async () => {
    try {
      // Iterate over drawnRectangles and send each rectangle's coordinates to the API
      const latestCoordinates = drawnRectangles[drawnRectangles.length - 1];
      console.log("AAAAAAAAAA");
      if (latestCoordinates) {
        const { topLeft, bottomRight } = latestCoordinates;
        const { x: x1, y: y1 } = topLeft;
        const { x: x2, y: y2 } = bottomRight;
        const status = 0;
        await Axios.post(
          `http://localhost:3001/readCamera/${selectedCamera}/addBoundedRectangle`,
          {
            x1,
            y1,
            x2,
            y2,
            status,
          }
        );
        // toast.success("Coordinates added successfully");
        console.log("Coordinates added successfully");
        setDrawnRectangles((prevCoordinates) => [
          ...prevCoordinates.slice(0, -1),
        ]);

        Axios.get(
          `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
        )
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error("Failed to get data:", error);
          });

        setTableKey((prevKey) => prevKey + 1);
      } else {
        // toast.warning("No coordinates to save");
        console.log("No coordinates to save");
      }
    } catch (err) {
      console.error("Failed to save coordinates:", err);
    }
  };

  return (
    <div className="bg-primary py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="flex gap-8">
          <div>
            {selectedCamera ? (
              <div>
                <ImageAnnotator
                  onBoxCreated={handleBoxCreated}
                  selectedRectangle={selectedRectangle}
                  selectedCamera={selectedCamera}
                />
                <div className="hidden sm:block m-2">
                  <button
                    className="bg-background flex gap-2 text-white text-lg p-2 rounded hover:bg-icon hover:text-black duration-150"
                    onClick={handleSaveButtonClick}
                  >
                    <UilSave />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <img src={placeholderImage} className="rounded-md" />
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
            onSelectedRectangleChange={handleSelectedRectangleChange}
            onDeleteRectangle={fetchData}
          />
        </div>
      )}
    </div>
  );
}
