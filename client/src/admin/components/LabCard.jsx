import { useState } from "react";
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { toast, ToastContainer } from "react-toastify";
import ModalOverlay from "./ModalOverlay";

export default function CameraCard({
  val,
  parentAreaId,
  updatedCameraData,
  onSelect,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
  const [editcameraName, setEditcameraName] = useState(val.Description);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const deleteCamera = (id) => {
    Axios.delete(
      `http://localhost:3001/readArea/${parentAreaId}/deleteCamera/${id}`
    )
      .then((res) => {
        console.log(res.data);
        updatedCameraData();
        toast.success("Camera deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openEditDialog = () => {
    setEditcameraName(val.Description);
    setIsEditingDialogOpen(true);
    closeMenu();
  };

  const handleSubmitDialog = () => {
    Axios.put(
      `http://localhost:3001/readArea/${parentAreaId}/updateCamera/${val.CameraID}`,
      {
        newDescription: editcameraName,
      }
    )
      .then((res) => {
        console.log(res.data);
        updatedCameraData();
        toast.success("Camera updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setIsEditingDialogOpen(false);
  };

  return (
    <div>
      <div
        className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer"
        onClick={() => onSelect(val.CameraID, val.Description)}
      >
        <div className="flex justify-between items-center p-4">
          <p className="text-xl font-bold tracking-tight text-white">
            {val.Description}
          </p>
          <MiOptionsVertical
            color="white"
            className="hover:bg-slate-400 hover:rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          />
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-0 right-12 bg-white border border-gray-300 rounded shadow-md z-10 w-24">
          <ul>
            <li>
              <button
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={openEditDialog}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                className="block px-4 py-2 text-red-600 hover:bg-red-200 w-full text-left"
                onClick={() => {
                  closeMenu();
                  deleteCamera(val.CameraID);
                }}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
      {isEditingDialogOpen && (
        <ModalOverlay isOpen={isEditingDialogOpen}>
          <Dialog
            text="Edit Camera"
            text2="Camera"
            name={editcameraName}
            setName={setEditcameraName}
            onClose={() => setIsEditingDialogOpen(false)}
            onSubmit={handleSubmitDialog}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
