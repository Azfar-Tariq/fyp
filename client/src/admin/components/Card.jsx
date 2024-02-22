import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalOverlay from "./ModalOverlay";

export default function Card({ val, updatedAreaData, onSelect }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editAreaName, setEditAreaName] = useState(val.areaName);
  const [editAreaDescription, setEditAreaDescription] = useState(val.description);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const deleteArea = (areaId) => {
    Axios.delete(`http://localhost:3001/deleteArea/${areaId}`)
      .then((res) => {
        console.log(res.data);
        updatedAreaData();
        toast.success("Area deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const openEditDialog = () => {
    setEditAreaName(val.areaName);
    setEditAreaDescription(val.description);
    setIsEditDialogOpen(true);
    closeMenu();
  };

  const handleSubmitDialog = () => {
    Axios.put(`http://localhost:3001/updateArea/${val.areaId}`, {
      newAreaName: editAreaName,
      newDescription: editAreaDescription,
    })
      .then((res) => {
        console.log(res.data);
        
        updatedAreaData();
        toast.success("Area updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      <div
  className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer"
  onClick={() => {
    console.log("value of value is OnCick in card.jsx = ",val);
    onSelect(val.areaId, val.areaName, val.description);
    console.log("AreaCard val prop:", val);

  }}
>
        <div className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xl font-bold tracking-tight text-white">
              {val.areaName}
            </p>
            <p className="text-sm text-gray-400">{val.description}</p>
          </div>
          <MiOptionsVertical
            color="white"
            className="hover:bg-gray-700 hover:rounded-md"
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
                  deleteArea(val.areaId);
                }}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
      {isEditDialogOpen && (
        <ModalOverlay isOpen={isEditDialogOpen}>
          <Dialog
  text="Edit Area"
  text2="Area"
  name={editAreaName}
  setName={setEditAreaName}
  description={editAreaDescription}
  setDescription={setEditAreaDescription}
  showDescriptionField={true} // Make sure this is set to true
  onClose={() => setIsEditDialogOpen(false)}
  onSubmit={handleSubmitDialog}
/>

        </ModalOverlay>
      )}
    </div>
  );
}
