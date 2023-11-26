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
		console.log("Box Coordinates:", boxCoordinates);
		try {
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
			updatePcData();
			toast.success("Coordinates added successfully");
		} catch (err) {
			console.error("Failed to save coordinates:", err);
		}
	};

	return (
		<div>
			<div className='flex items-center gap-2'>
				<a
					onClick={backToBuildings}
					className='text-gray-700 text-lg font-semibold hover:text-blue-600 cursor-pointer'
				>
					Buildings
				</a>
				<MaterialSymbolsArrowForwardIosRounded />
				<a
					onClick={backToLabs}
					className='text-gray-700 text-lg font-semibold hover:text-blue-600 cursor-pointer'
				>
					Labs
				</a>
				<MaterialSymbolsArrowForwardIosRounded />
				<span>PCs</span>
			</div>
			<ToastContainer />
			<div className='flex items-center gap-2 mb-2'>
				<p
					className='text-gray-700 hover:text-blue-600 cursor-pointer text-lg font-semibold'
					onClick={backToBuildings}
				>
					{parentBuildingName}
				</p>
				<MaterialSymbolsArrowForwardIosRounded />
				<p
					className='text-gray-700 hover:text-blue-600 cursor-pointer text-lg font-semibold'
					onClick={backToLabs}
				>
					{parentLabName}
				</p>
			</div>
			<ImageAnnotator
				onBoxCreated={handleBoxCreated}
				pcData={pcData}
				parentBuildingId={parentBuildingId}
				parentLabId={parentLabId}
			/>
			{/*<div>
				{pcData.map((val, index) => (
					<div key={index}>
						<p>{val.x1}</p>
						<p>{val.y1}</p>
						<p>{val.x2}</p>
						<p>{val.y2}</p>
						<p>{String(val.pcStatus)}</p>
					</div>
				))}
				</div>*/}
		</div>
	);
}
