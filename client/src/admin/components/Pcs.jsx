import { useEffect, useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import ImageAnnotator from "./ImageAnnotator";

const fetchRectangleData = async (cameraId, setRectangleData) => {
  try {
    const response = await Axios.get(
      `http://localhost:3001/readCamera/${cameraId}/readBoundedRectangles`
    );
    setRectangleData(response.data);
  } catch (err) {
    console.error("Failed to get Rectangle Data:", err);
  }
};

export default function Pcs({
  cameraId,
  backToCameras,
}) {
  const [rectangleData, setRectangleData] = useState([]);
  const [drawnRectangles, setDrawnRectangles] = useState([]);

  const updateRectangleData = () => {
    fetchRectangleData(cameraId, setRectangleData);
  };

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/readCamera/${cameraId}/readBoundedRectangles`
    )
      .then((response) => {
        setRectangleData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Failed to get rectangles:", error);
      });
  }, [cameraId]);

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
      if (latestCoordinates) {
        const { topLeft, bottomRight } = latestCoordinates;
        const { x: x1, y: y1 } = topLeft;
        const { x: x2, y: y2 } = bottomRight;
        const status = 0;
        await Axios.post(
          `http://localhost:3001/readCamera/${cameraId}/addBoundedRectangle`,
          {
            x1,
            y1,
            x2,
            y2,
            status,
          }
        );
        // After successfully saving all rectangles, update the displayed data
        updateRectangleData();
        toast.success("Coordinates added successfully");
        // Clear the drawn rectangles after saving
        setDrawnRectangles((prevCoordinates) => [
          ...prevCoordinates.slice(0, -1),
        ]);
      } else {
        toast.warning("No coordinates to save");
      }
    } catch (err) {
      console.error("Failed to save coordinates:", err);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="flex items-center gap-2 mb-2">
        <p
          className="text-2xl sm:text-lg text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 px-2 rounded-lg cursor-pointer font-semibold"
          onClick={backToCameras}
        >
          {cameraId}
        </p>
      </div>
      <div className="flex sm:hidden">
        <p className="m-2">To edit, please use a desktop browser</p>
        <span className="bg-blue-700 p-1 m-2 text-lg rounded-lg text-white text-center">
          View-only mode
        </span>
      </div>
      <div className="overflow-x-auto">
        <ImageAnnotator onBoxCreated={handleBoxCreated} rectangleData={rectangleData} />
      </div>
      <div className="hidden sm:block m-2">
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleSaveButtonClick}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
