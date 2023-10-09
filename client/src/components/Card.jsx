import { MiOptionsVertical } from "../assets/icons/options";
import Image1 from "../assets/images/blockC.jpg";
import Axios from "axios";
import Dialog from "./Dialog";
import { useState } from "react";

export default function Card({ val, onSelect }) {
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
		Axios.delete(`http://localhost:3001/delete/${id}`);
	};

	const openEditDialog = () => {
		setEditBuildingName(val.buildingName);
		setIsEditDialogOpen(true);
		closeMenu();
	};

	return (
		<div>
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700'
				onClick={() => onSelect(val.buildingName)}
			>
				<a href='#'>
					<img
						className='rounded-t-lg object-cover w-full h-full'
						src={Image1}
						alt=''
					/>
					<div className='p-4 flex justify-between items-center'>
						<h5 className=' text-xl font-bold tracking-tight text-white'>
							{val.buildingName}
						</h5>
						<MiOptionsVertical
							color='white'
							className='hover:bg-gray-700 hover:rounded-md'
							onClick={toggleMenu}
						/>
					</div>
				</a>
			</div>
			{isMenuOpen && (
				<div className='bg-white border border-gray-300 rounded shadow-md z-10'>
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
					text='Edit'
					buildingName={editBuildingName}
					setBuildingName={setEditBuildingName}
					onClose={() => setIsEditDialogOpen(false)}
					onSubmit={() => {
						Axios.put(`http://localhost:3001/update/${val._id}`, {
							newBuildingName: editBuildingName,
						})
							.then((res) => {
								console.log(res.data);
							})
							.catch((err) => {
								console.log(err);
							});
						setIsEditDialogOpen(false);
					}}
				/>
			)}
		</div>
	);
}
