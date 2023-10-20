/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import LabCard from "./LabCard";
import Axios from "axios";
import Add from "./Add";
import Dialog from "./Dialog";
import Pcs from "./Pcs";

const fetchLabData = async (parentBuildingId, setLabData) => {
	try {
		const response = await Axios.get(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab`
		);
		setLabData(response.data);
	} catch (err) {
		console.error("Failed to get lab data:", err);
	}
};

export default function Labs({
	parentBuildingId,
	parentBuildingName,
	toggleLabs,
}) {
	const [labData, setLabData] = useState([]);
	const [labName, setLabName] = useState("");
	const [labImage, setLabImage] = useState(null);
	const [selectedLabId, setSelectedLabId] = useState(null);
	const [selectedLabName, setSelectedLabName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showImageInput, setShowImageInput] = useState(true);

	const updatedLabData = () => {
		fetchLabData(parentBuildingId, setLabData);
	};

	useEffect(() => {
		Axios.get(`http://localhost:3001/readBuilding/${parentBuildingId}/readLab`)
			.then((response) => {
				setLabData(response.data);
			})
			.catch((error) => {
				console.error("Failed to get labs:", error);
			});
	}, [parentBuildingId]);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		const formData = new FormData();
		formData.append("labName", labName);
		formData.append("labImage", labImage);
		Axios.post(
			`http://localhost:3001/readbuilding/${parentBuildingId}/addLab`,
			formData
		)
			.then((response) => {
				console.log(response.data);
				updatedLabData();
			})
			.catch((err) => {
				console.error("Failed to save lab:", err);
			});
		setIsDialogOpen(false);
		setLabName("");
		setLabImage(null);
	};

	const handleSelectLab = (labId, labName) => {
		setSelectedLabId(labId);
		setSelectedLabName(labName);
	};

	const handleBackToLabs = () => {
		setSelectedLabId(null);
		setSelectedLabName("");
	};

	return (
		<div className='p-4'>
			<button className='text-blue-600 hover:underline' onClick={toggleLabs}>
				Back to Buildings
			</button>
			<h3 className='text-lg font-semibold mb-2'>{parentBuildingName}</h3>
			{selectedLabId === null ? (
				<div>
					<div className='grid grid-cols-3 gap-4'>
						{labData.map((val, index) => (
							<div key={index} className='relative'>
								<LabCard
									val={val}
									image={`http://localhost:3001/${val.labImage}`}
									parentBuildingId={parentBuildingId}
									updatedLabData={updatedLabData}
									onSelect={() => handleSelectLab(val._id, val.labName)}
								/>
							</div>
						))}
					</div>
					<Add toggleDialog={toggleDialog} text='Lab' />
					{isDialogOpen && (
						<Dialog
							text='Add Lab'
							text2='Lab'
							name={labName}
							setName={setLabName}
							image={labImage}
							setImage={setLabImage}
							showImageInput={showImageInput}
							onClose={toggleDialog}
							onSubmit={handleSubmitDialog}
						/>
					)}
				</div>
			) : (
				<div>
					<Pcs
						parentBuildingId={parentBuildingId}
						parentBuildingName={parentBuildingName}
						parentLabId={selectedLabId}
						parentLabName={selectedLabName}
						toggleLabs={handleBackToLabs}
					/>
				</div>
			)}
		</div>
	);
}
