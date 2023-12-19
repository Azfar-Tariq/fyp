/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import ImageAnnotator from "./ImageAnnotator";



const fetchPcData = async (parentBuildingId, parentLabId, setPcData) => {
  try {
    const response = await Axios.get(
      `http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/readCoordinates`
    );
    setPcData(response.data);
  } catch (err) {
    console.error("Failed to get PC Data:", err);
  }
};

export default function UserPcs({
  parentBuildingId,
  parentBuildingName,
  parentLabId,
  parentLabName,
  backToLabs,
  backToBuildings,
}) {
  const [pcData, setPcData] = useState([]);

  const [requestSent, setRequestSent] = useState(false);

  const handleManualRequest = async () => {
    try {
      const loggedInEmail = localStorage.getItem("email");
      if (!loggedInEmail) {
        console.error("No logged-in email found.");
        return;
      }

      await Axios.post("http://localhost:3001/request-manual-control", {
        teacherEmail: loggedInEmail,
        labId: parentLabId,
        buildingId: parentBuildingId,
      });

      setRequestSent(true);
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Error sending manual control request:", error);
      toast.error("Failed to send request. Please try again.");
    }
  };

  useEffect(() => {
    Axios.get(
      `http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/readCoordinates`
    )
      .then((response) => {
        setPcData(response.data);
      })
      .catch((error) => {
        console.error("Failed to get labs:", error);
      });
  }, [parentBuildingId, parentLabId]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <a
          onClick={backToBuildings}
          className="text-gray-700 text-lg font-semibold hover:text-blue-600 cursor-pointer"
        >
          Buildings
        </a>
        <MaterialSymbolsArrowForwardIosRounded />
        <a
          onClick={backToLabs}
          className="text-gray-700 text-lg font-semibold hover:text-blue-600 cursor-pointer"
        >
          Labs
        </a>
        <MaterialSymbolsArrowForwardIosRounded />
        <span>PCs</span>
      </div>
      <ToastContainer />
      <div className="flex items-center gap-2 mb-2">
        <p
          className="text-gray-700 hover:text-blue-600 cursor-pointer text-lg font-semibold"
          onClick={backToBuildings}
        >
          {parentBuildingName}
        </p>
        <MaterialSymbolsArrowForwardIosRounded />
        <p
          className="text-gray-700 hover:text-blue-600 cursor-pointer text-lg font-semibold"
          onClick={backToLabs}
        >
          {parentLabName}
        </p>
		{requestSent ? (
        <div className="text-green-600">Request Sent</div>
      ) : (
        <button onClick={handleManualRequest}>Request Manual Control</button>
      )}
      </div>
      <ImageAnnotator pcData={pcData} readOnly={true} />
    </div>
  );
}
