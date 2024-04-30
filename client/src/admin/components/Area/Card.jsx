// /* eslint-disable no-unused-vars */
// import { MiOptionsVertical } from "../assets/icons/options";
// import Axios from "axios";
// import Dialog from "./Dialog";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import ModalOverlay from "./ModalOverlay";

// export default function Card({ val, updatedAreaData, onSelect }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editAreaName, setEditAreaName] = useState("");

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const deleteArea = (id) => {
//     Axios.delete(`http://localhost:3001/deletearea/${id}`)
//       .then((res) => {
//         console.log(res.data);
//         updatedAreaData();
//         toast.success("Area deleted successfully");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const openEditDialog = () => {
//     setEditAreaName(val.areaName);
//     setIsEditDialogOpen(true);
//     closeMenu();
//   };

//   const handleSubmitDialog = () => {
//     Axios.put(`http://localhost:3001/updateArea/${val.id}`, {
//       newAreaName: editAreaName,
//     })
//       .then((res) => {
//         console.log(res.data);
//         updatedAreaData();
//         toast.success("Area updated successfully");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     setIsEditDialogOpen(false);
//   };

//   return (
//     <div>
//       <div
//         className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer"
//         onClick={() => onSelect(val.id, val.areaName)}
//       >
//         <div className="p-4 flex justify-between items-center">
//           <p className=" text-xl font-bold tracking-tight text-white">
//             {val.areaName}
//           </p>
//           <MiOptionsVertical
//             color="white"
//             className="hover:bg-gray-700 hover:rounded-md"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleMenu();
//             }}
//           />
//         </div>
//       </div>
//       {isMenuOpen && (
//         <div className="absolute top-0 right-12 bg-white border border-gray-300 rounded shadow-md z-10 w-24">
//           <ul>
//             <li>
//               <button
//                 className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
//                 onClick={openEditDialog}
//               >
//                 Edit
//               </button>
//             </li>
//             <li>
//               <button
//                 className="block px-4 py-2 text-red-600 hover:bg-red-200 w-full text-left"
//                 onClick={() => {
//                   closeMenu();
//                   deleteArea(val.id);
//                 }}
//               >
//                 Delete
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//       {isEditDialogOpen && (
//         <ModalOverlay isOpen={isEditDialogOpen}>
//           <Dialog
//             text="Edit Area"
//             text2="Area"
//             name={editAreaName}
//             setName={setEditAreaName}
//             onClose={() => setIsEditDialogOpen(false)}
//             onSubmit={handleSubmitDialog}
//           />
//         </ModalOverlay>
//       )}
//     </div>
//   );
// }

export default function Card({ val }) {
  return (
    <div className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer">
      <div className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold tracking-tight text-white">
          {val.areaName}
        </p>
      </div>
    </div>
  );
}
