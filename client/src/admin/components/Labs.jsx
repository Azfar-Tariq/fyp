import { useEffect, useState } from "react";
import LabCard from "./LabCard"; // Make sure to import the correct component
import Axios from "axios";
import Add from "./Add";
import Dialog from "./Dialog";
import { toast } from "react-toastify";
import ModalOverlay from "./ModalOverlay";
import { PulseLoader } from "react-spinners";

const fetchCameraData = async (parentAreaId, setCameraData) => {
  try {
    const response = await Axios.get(
      `http://localhost:3001/readArea/${parentAreaId}/readCamera`
    );
    setCameraData(response.data);
  } catch (err) {
    console.error("Failed to get camera data:", err);
  }
};

export default function Cameras({
  parentAreaId,
  parentAreaName,
  backToAreas,
}) {
  const [cameraData, setCameraData] = useState([]);
  const [cameraDescription, setCameraDescription] = useState("");
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [selectedCameraDescription, setSelectedCameraDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updatedCameraData = () => {
    fetchCameraData(parentAreaId, setCameraData);
  };

  useEffect(() => {
    setLoading(true);
    fetchCameraData(parentAreaId, setCameraData);
    setLoading(false);
  }, [parentAreaId]);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleSubmitDialog = () => {
    Axios.post(
      `http://localhost:3001/readArea/${parentAreaId}/addCamera`,
      {
        description: cameraDescription,
      }
    )
      .then((response) => {
        console.log(response.data);
        updatedCameraData();
        toast.success("Camera added successfully");
      })
      .catch((err) => {
        console.error("Failed to save camera:", err);
      });
    setIsDialogOpen(false);
    setCameraDescription("");
  };

  const handleSelectCamera = (cameraId, cameraDescription) => {
    setSelectedCameraId(cameraId);
    setSelectedCameraDescription(cameraDescription);
  };

  const handleBackToCameras = () => {
    setSelectedCameraId(null);
    setSelectedCameraDescription("");
  };

  return (
    <div>
      {selectedCameraId === null ? (
        <div>
          <div className="flex">
            <p
              className="text-2xl sm:text-lg text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 px-2 rounded-lg font-semibold mb-2 cursor-pointer"
              onClick={backToAreas}
            >
              {parentAreaName}
            </p>
          </div>
          {loading && (
            <div>
              <PulseLoader />
            </div>
          )}
          {cameraData.length === 0 ? (
            <div>
              <p>No Cameras currently</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cameraData.map((val, index) => (
                <div key={index} className="relative">
                  <LabCard
                    val={val}
                    parentAreaId={parentAreaId}
                    updatedCameraData={updatedCameraData}
                    onSelect={() => handleSelectCamera(val.CameraID, val.Description)}
                  />
                </div>
              ))}
            </div>
          )}
          <Add toggleDialog={toggleDialog} text="Camera" />
          {isDialogOpen && (
            <ModalOverlay isOpen={isDialogOpen}>
              <Dialog
                text="Add Camera"
                text2="Camera"
                name={cameraDescription}
                setName={setCameraDescription}
                onClose={toggleDialog}
                onSubmit={handleSubmitDialog}
              />
            </ModalOverlay>
          )}
        </div>
      ) : (
        <div>
          {/* Content for selected camera */}
        </div>
      )}
    </div>
  );
}
