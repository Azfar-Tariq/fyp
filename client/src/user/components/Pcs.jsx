/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import { io } from "socket.io-client";
import ImageAnnotator from "./ImageAnnotator";
import MannualRequestButtons from "./MannualRequestButtons";

const socket = io("http://localhost:3001"); // Connect to the backend Socket.IO server

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
    // Subscribe to manual control notifications
    socket.on("manualControlNotification", (data) => {
      // if (data.email === localStorage.getItem("email")) {
      // Check if the notification is intended for the logged-in user

      if (data.status === "Granted") {
        toast.success("Manual control request granted!");
      } else if (data.status === "Denied") {
        toast.error("Manual control request denied!");
      }
      // }
      console.log(data.email, data.status);
    });

    // Fetch PC data
    fetchPcData(parentBuildingId, parentLabId, setPcData);

    return () => {
      // Clean up event listeners
      socket.off("manualControlNotification");
    };
  }, [parentBuildingId, parentLabId]);

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <div className="flex items-center gap-2 mb-2">
        <p
          className="text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 pl-2 pr-2 rounded-lg cursor-pointer text-lg font-semibold"
          onClick={backToBuildings}
        >
          {parentBuildingName}
        </p>
        <MaterialSymbolsArrowForwardIosRounded />
        <p
          className="text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 pl-2 pr-2 rounded-lg cursor-pointer text-lg font-semibold"
          onClick={backToLabs}
        >
          {parentLabName}
        </p>
      </div>

      <ImageAnnotator pcData={pcData} readOnly={true} />

      <div className="mt-4">
        {requestSent ? (
          <div className="text-green-600">Request Sent</div>
        ) : (
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={handleManualRequest}
          >
            Request Manual Control
          </button>
        )}
      </div>

      {/*<div className="mt-4">
        <MannualRequestButtons />
        </div>*/}
    </div>
  );
}
