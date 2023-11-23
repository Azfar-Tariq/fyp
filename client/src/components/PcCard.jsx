/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";
import { toast, ToastContainer } from "react-toastify";
import ModalOverlay from "./ModalOverlay";

export default function PcCard({
	val,
	parentBuildingId,
	parentLabId,
	updatePcData,
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
	const [editPcName, setEditPcName] = useState(val.pcName);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const toggleStatus = () => {
		val.pcStatus = !val.pcStatus;
		Axios.put(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/updatePC/${val.id}`,
			{
				pcName: editPcName,
				pcStatus: val.pcStatus,
			}
		)
			.then((res) => {
				console.log(res.data);
				updatePcData();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deletePc = (id) => {
		Axios.delete(
			`http://localhost:3001/readbuilding/${parentBuildingId}/readLab/${parentLabId}/deletePc/${id}`
		)
			.then(() => {
				updatePcData();
				toast.success("PC deleted successfully");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const openEditDialog = () => {
		setEditPcName(val.pcName);
		setIsEditingDialogOpen(true);
		closeMenu();
	};

	const handleSubmitDialog = () => {
		Axios.put(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/updatePc/${val.id}`,
			{
				pcName: editPcName,
			}
		)
			.then((res) => {
				console.log(res.data);
				updatePcData();
				toast.success("PC updated successfully");
			})
			.catch((err) => {
				console.log(err);
			});
		setIsEditingDialogOpen(false);
	};

	return (
		<div>
			<ToastContainer />
			<div className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'>
				<div className='flex justify-between items-center p-4'>
					<p className='text-xl font-bold tracking-tight text-white'>
						{val.pcName}
					</p>
					<label className='relative inline-flex items-center cursor-pointer'>
						<input
							type='checkbox'
							className='sr-only peer'
							checked={val.pcStatus}
							onChange={toggleStatus}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
					</label>
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
				<div className='absolute bottom-12 right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-24'>
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
									deletePc(val.id);
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
						text='Edit PC'
						text2='PC'
						name={editPcName}
						setName={setEditPcName}
						onClose={() => setIsEditingDialogOpen(false)}
						onSubmit={handleSubmitDialog}
					/>
				</ModalOverlay>
			)}
		</div>
	);
}
