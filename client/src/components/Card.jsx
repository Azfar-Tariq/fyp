/* eslint-disable no-unused-vars */
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ModalOverlay from "./ModalOverlay";

export default function Card({ val, updatedBuildingData, onSelect }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editBuildingName, setEditBuildingName] = useState("");

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const deleteBuilding = (id) => {
		Axios.delete(`http://localhost:3001/deletebuilding/${id}`)
			.then((res) => {
				console.log(res.data);
				updatedBuildingData();
				toast.success("Building deleted successfully");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const openEditDialog = () => {
		setEditBuildingName(val.buildingName);
		setIsEditDialogOpen(true);
		closeMenu();
	};

	const handleSubmitDialog = () => {
		Axios.put(`http://localhost:3001/updateBuilding/${val.id}`, {
			newBuildingName: editBuildingName,
		})
			.then((res) => {
				console.log(res.data);
				updatedBuildingData();
				toast.success("Building updated successfully");
			})
			.catch((err) => {
				console.log(err);
			});
		setIsEditDialogOpen(false);
	};

	return (
		<div>
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'
				onClick={() => onSelect(val.id, val.buildingName)}
			>
				<div className='p-4 flex justify-between items-center'>
					<p className=' text-xl font-bold tracking-tight text-white'>
						{val.buildingName}
					</p>
					<MiOptionsVertical
						color='white'
						className='hover:bg-gray-700 hover:rounded-md'
						onClick={(e) => {
							e.stopPropagation();
							toggleMenu();
						}}
					/>
				</div>
			</div>
			{isMenuOpen && (
				<div className='absolute bottom-0 right-12 bg-white border border-gray-300 rounded shadow-md z-10 w-24'>
					<ul>
						<li>
							<button
								className='block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left'
								onClick={openEditDialog}
							>
								Edit
							</button>
						</li>
						<li>
							<button
								className='block px-4 py-2 text-red-600 hover:bg-red-200 w-full text-left'
								onClick={() => {
									closeMenu();
									deleteBuilding(val.id);
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
						text='Edit Building'
						text2='Building'
						name={editBuildingName}
						setName={setEditBuildingName}
						onClose={() => setIsEditDialogOpen(false)}
						onSubmit={handleSubmitDialog}
					/>
				</ModalOverlay>
			)}
		</div>
	);
}
