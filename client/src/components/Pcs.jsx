/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
import Add from "./Add";
import Dialog from "./Dialog";
import PcCard from "./PcCard";

const fetchPcData = async (parentBuildingId, parentLabId, setPcData) => {
	try {
		const response = await Axios.get(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/readPc`
		);
		setPcData(response.data);
	} catch (err) {
		console.error("Failed to get PC Data:", err);
	}
};

export default function Pcs({
	parentBuildingId,
	parentLabId,
	parentLabName,
	toggleLabs,
}) {
	const [pcData, setPcData] = useState([]);
	const [pcName, setPcName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showImageInput, setShowImageInput] = useState(false);

	const updatePcData = () => {
		fetchPcData(parentBuildingId, parentLabId, setPcData);
	};

	useEffect(() => {
		fetchPcData(parentBuildingId, parentLabId, setPcData);
	}, [parentBuildingId, parentLabId]);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		Axios.post(
			`http://localhost:3001/readbuilding/${parentBuildingId}/readLab/${parentLabId}/addPc`,
			{
				pcName: pcName,
			}
		)
			.then((response) => {
				console.log(response.data);
				fetchPcData(parentBuildingId, parentLabId, setPcData);
			})
			.catch((err) => {
				console.error("Failed to save lab:", err);
			});
		setPcName("");
		setIsDialogOpen(false);
	};

	return (
		<div className='pt-4 pr-4 pb-4'>
			<button className='text-blue-600 hover:underline' onClick={toggleLabs}>
				Back to Labs
			</button>
			<h3 className='text-lg font-semibold'>{parentLabName}</h3>
			<div>
				<div className='grid grid-cols-3 gap-4'>
					{pcData.map((val, index) => (
						<div key={index} className='relative'>
							<PcCard
								val={val}
								parentBuildingId={parentBuildingId}
								parentLabId={parentLabId}
								updatePcData={updatePcData}
							/>
						</div>
					))}
				</div>

				{isDialogOpen && (
					<Dialog
						text='Add PC'
						text2='PC'
						name={pcName}
						setName={setPcName}
						showImageInput={showImageInput}
						onClose={toggleDialog}
						onSubmit={handleSubmitDialog}
					/>
				)}
			</div>

			<Add toggleDialog={toggleDialog} text='PC' />
		</div>
	);
}
