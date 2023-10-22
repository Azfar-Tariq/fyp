/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";
import Labs from "../components/Labs";
import { ToastContainer, toast } from "react-toastify";
import ModalOverlay from "../components/ModalOverlay";

const fetchData = async (setBuildingList) => {
	try {
		const response = await Axios.get("http://localhost:3001/readBuilding");
		setBuildingList(response.data);
	} catch (err) {
		console.error("Failed to get buildings:", err);
	}
};

export default function Dashboard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [buildingName, setBuildingName] = useState("");
	const [buildingImage, setBuildingImage] = useState(null);
	const [buildingList, setBuildingList] = useState([]);
	const [selectedBuildingId, setSelectedBuildingId] = useState(null);
	const [selectedBuildingName, setSelectedBuildingName] = useState("");
	const [showImageInput, setShowImageInput] = useState(true);

	const updatedBuildingData = () => {
		fetchData(setBuildingList);
	};

	useEffect(() => {
		Axios.get("http://localhost:3001/readBuilding")
			.then((response) => {
				setBuildingList(response.data);
			}, [])
			.catch((err) => {
				console.error("Failed to get buildings:", err);
			});
	}, []);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		const formData = new FormData();
		formData.append("buildingName", buildingName);
		formData.append("buildingImage", buildingImage);

		Axios.post("http://localhost:3001/insertBuilding", formData)
			.then((response) => {
				console.log(response.data);
				updatedBuildingData();
				toast.success("Building added successfully");
			})
			.catch((error) => {
				console.error("Failed to save building:", error);
			});
		setIsDialogOpen(false);
		setBuildingName("");
		setBuildingImage(null);
	};

	const handleSelectBuilding = (buildingId, buildingName) => {
		setSelectedBuildingId(buildingId);
		setSelectedBuildingName(buildingName);
	};

	const handleBackToBuildings = () => {
		setSelectedBuildingId(null);
		setSelectedBuildingName("");
	};

	return (
		<div className='col-span-4 px-6 py-4 h-screen flex flex-col'>
			<Header title='Dashboard' />
			<ToastContainer />
			<div className='overflow-y-auto'>
				{selectedBuildingId === null ? (
					<div>
						<div className='mb-2'>
							<a className='text-lg font-semibold'>Buildings</a>
						</div>
						<div className='grid grid-cols-3 gap-4'>
							{buildingList.map((val, index) => (
								<div key={index} className='relative'>
									<Card
										val={val}
										image={`http://localhost:3001/${val.buildingImage}`}
										updatedBuildingData={updatedBuildingData}
										onSelect={() =>
											handleSelectBuilding(
												val._id,
												val.buildingName,
												val.buildingImage
											)
										}
									/>
								</div>
							))}
						</div>
						<Add toggleDialog={toggleDialog} text='Building' />
						{isDialogOpen && (
							<ModalOverlay isOpen={isDialogOpen}>
								<Dialog
									text='Add Building'
									text2='Building'
									name={buildingName}
									setName={setBuildingName}
									image={buildingImage}
									setImage={setBuildingImage}
									showImageInput={showImageInput}
									onClose={toggleDialog}
									onSubmit={handleSubmitDialog}
								/>
							</ModalOverlay>
						)}
					</div>
				) : (
					<div>
						<Labs
							parentBuildingId={selectedBuildingId}
							parentBuildingName={selectedBuildingName}
							backToBuildings={handleBackToBuildings}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
