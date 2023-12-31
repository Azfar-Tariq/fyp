/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { toast, ToastContainer } from "react-toastify";
import ModalOverlay from "./ModalOverlay";

export default function LabCard({
	val,
	parentBuildingId,
	updatedLabData,
	onSelect,
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
	const [editLabName, setEditLabName] = useState(val.labName);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const deleteLab = (id) => {
		Axios.delete(
			`http://localhost:3001/readbuilding/${parentBuildingId}/deleteLab/${id}`
		)
			.then((res) => {
				console.log(res.data);
				updatedLabData();
				toast.success("Lab deleted successfully");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const openEditDialog = () => {
		setEditLabName(val.labName);
		setIsEditingDialogOpen(true);
		closeMenu();
	};

	const handleSubmitDialog = () => {
		Axios.put(
			`http://localhost:3001/readBuilding/${parentBuildingId}/updateLab/${val.id}`,
			{
				newLabName: editLabName,
			}
		)
			.then((res) => {
				console.log(res.data);
				updatedLabData();
				toast.success("Lab updated successfully");
			})
			.catch((err) => {
				console.log(err);
			});
		setIsEditingDialogOpen(false);
	};

	return (
		<div>
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'
				onClick={() => onSelect(val.id, val.labName)}
			>
				<div className='flex justify-between items-center p-4'>
					<p className='text-xl font-bold tracking-tight text-white'>
						{val.labName}
					</p>
					<MiOptionsVertical
						color='white'
						className='hover:bg-slate-400 hover:rounded-md'
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
									deleteLab(val.id);
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
						text='Edit Lab'
						text2='Lab'
						name={editLabName}
						setName={setEditLabName}
						onClose={() => setIsEditingDialogOpen(false)}
						onSubmit={handleSubmitDialog}
					/>
				</ModalOverlay>
			)}
		</div>
	);
}
