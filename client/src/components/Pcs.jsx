/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";
import ImageAnnotator from "./ImageAnnotator";

const fetchPcData = async (parentBuildingId, parentLabId, setPcData) => {
	try {
		const response = await Axios.get(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/readCoordinates`
		);
		setPcData(response.data);
	} catch (err) {
		console.error("Failed to get PC Data:", err);
	}
};

export default function Pcs({
	parentBuildingId,
	parentBuildingName,
	parentLabId,
	parentLabName,
	backToLabs,
	backToBuildings,
}) {
	const [pcData, setPcData] = useState([]);
	const [drawnRectangles, setDrawnRectangles] = useState([]);

	const updatePcData = () => {
		fetchPcData(parentBuildingId, parentLabId, setPcData);
	};

	useEffect(() => {
		// setLoading(true);
		Axios.get(
			`http://localhost:3001/readBuilding/${parentBuildingId}/readLab/${parentLabId}/readCoordinates`
		)
			.then((response) => {
				setPcData(response.data);
				console.log(response.data);
				// setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to get labs:", error);
				// setLoading(false);
			});
	}, [parentBuildingId, parentLabId]);

	const handleBoxCreated = async (boxCoordinates) => {
		setDrawnRectangles((prevCoordinates) => [
			...prevCoordinates,
			boxCoordinates,
		]);
	};

	const handleSaveButtonClick = async () => {
		try {
			// Iterate over drawnRectangles and send each rectangle's coordinates to the API
			for (const boxCoordinates of drawnRectangles) {
				const { topLeft, bottomRight } = boxCoordinates;
				const { x: x1, y: y1 } = topLeft;
				const { x: x2, y: y2 } = bottomRight;
				const pcStatus = 0;
				await Axios.post(
					`http://localhost:3001/readbuilding/${parentBuildingId}/readLab/${parentLabId}/addCoordinates`,
					{
						x1,
						y1,
						x2,
						y2,
						pcStatus,
					}
				);
			}
			// After successfully saving all rectangles, update the displayed data
			updatePcData();
			toast.success("Coordinates added successfully");
			// Clear the drawn rectangles after saving
			setDrawnRectangles([]);
		} catch (err) {
			console.error("Failed to save coordinates:", err);
		}
	};

	return (
		<div>
			<div className='flex items-center gap-2 mb-2'>
				<p
					className='text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 pl-2 pr-2 rounded-lg cursor-pointer text-lg font-semibold'
					onClick={backToBuildings}
				>
					{parentBuildingName}
				</p>
				<MaterialSymbolsArrowForwardIosRounded />
				<p
					className='text-gray-700 hover:bg-blue-500 hover:text-white hover:transition hover:ease-in-out hover:delay-200 pl-2 pr-2 rounded-lg cursor-pointer text-lg font-semibold'
					onClick={backToLabs}
				>
					{parentLabName}
				</p>
			</div>
			<ImageAnnotator onBoxCreated={handleBoxCreated} pcData={pcData} />
			<button
				className='bg-blue-500 text-white p-2 rounded'
				onClick={handleSaveButtonClick}
			>
				Save Changes
			</button>
		</div>
	);
}
