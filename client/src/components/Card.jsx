/* eslint-disable no-unused-vars */
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { useState } from "react";

export default function Card({ val, image, updatedBuildingData, onSelect }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editBuildingName, setEditBuildingName] = useState("");
	const [showImageInput, setShowImageInput] = useState(true);

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
		Axios.put(`http://localhost:3001/updateBuilding/${val._id}`, {
			newBuildingName: editBuildingName,
		})
			.then((res) => {
				console.log(res.data);
				updatedBuildingData();
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
				onClick={() => onSelect(val.buildingName)}
			>
				<img
					className='rounded-t-lg object-cover w-full h-full'
					src={image}
					alt=''
				/>
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
				<div className='absolute bg-white border border-gray-300 rounded shadow-md z-10 w-24'>
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
									deleteBuilding(val._id);
								}}
							>
								Delete
							</button>
						</li>
					</ul>
				</div>
			)}
			{isEditDialogOpen && (
				<Dialog
					text='Edit Building'
					text2='Building'
					name={editBuildingName}
					setName={setEditBuildingName}
					showImageInput={showImageInput}
					onClose={() => setIsEditDialogOpen(false)}
					onSubmit={handleSubmitDialog}
				/>
			)}
		</div>
	);
}
