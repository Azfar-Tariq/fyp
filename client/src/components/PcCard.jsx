import { useState } from "react";
import { MiOptionsVertical } from "../assets/icons/options";
import Axios from "axios";
import Dialog from "./Dialog";

export default function PcCard({
	val,
	parentBuildingId,
	parentLabId,
	onSelect,
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isEditingDialogOpen, setIsEditingDialogOpen] = useState(false);
	const [editPcName, setEditPcName] = useState("");

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const deletePc = (id) => {
		Axios.delete(
			`http://localhost:3001/readbuilding/${parentBuildingId}/readLab/${parentLabId}/deletePc/${id}`
		);
	};

	const openEditDialog = () => {
		setEditPcName(val.pcName);
		setIsEditingDialogOpen(true);
		closeMenu();
	};

	return (
		<div>
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'
				onClick={() => onSelect(val.pcName)}
			>
				<div className='flex justify-between items-center p-4'>
					<p className='text-xl font-bold tracking-tight text-white'>
						{val.pcName}
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
				<div className='absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-24'>
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
									deletePc(val._id);
								}}
							>
								Delete
							</button>
						</li>
					</ul>
				</div>
			)}
			{isEditingDialogOpen && (
				<Dialog
					text='Edit PC'
					text2='PC'
					name={editPcName}
					setName={setEditPcName}
					onClose={() => setIsEditingDialogOpen(false)}
					onSubmit={() => {
						Axios.put(
							`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/updatePc/${val._id}`,
							{
								pcName: editPcName,
							}
						)
							.then((res) => {
								console.log(res.data);
							})
							.catch((err) => {
								console.log(err);
							});
						setIsEditingDialogOpen(false);
					}}
				/>
			)}
		</div>
	);
}
