import { useEffect, useState } from "react";
import LabCard from "./LabCard";
import Axios from "axios";
import Add from "./Add";
import Dialog from "./Dialog";
import Pcs from "./Pcs";

export default function Labs({
	parentBuildingId,
	parentBuildingName,
	toggleLabs,
}) {
	const [labData, setLabData] = useState([]);
	const [labName, setLabName] = useState("");
	const [selectedLabId, setSelectedLabId] = useState(null);
	const [selectedLabName, setSelectedLabName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
		Axios.post(
			`http://localhost:3001/readbuilding/${parentBuildingId}/addLab`,
			{
				labName: labName,
			}
		)
			.then((response) => {
				console.log(response.data);
			})
			.catch((err) => {
				console.error("Failed to save lab:", err);
			});
		setIsDialogOpen(false);
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
									parentBuildingId={parentBuildingId}
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
