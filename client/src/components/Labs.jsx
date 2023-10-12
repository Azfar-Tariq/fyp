import { useEffect, useState } from "react";
import LabCard from "./LabCard";
import Axios from "axios";

export default function Labs({
	parentBuildingId,
	parentBuildingName,
	toggleLabs,
}) {
	const [labData, setLabData] = useState([]);

	useEffect(() => {
		Axios.get(`http://localhost:3001/readBuilding/${parentBuildingId}/readLab`)
			.then((response) => {
				setLabData(response.data);
			})
			.catch((error) => {
				console.error("Failed to get labs:", error);
			});
	}, [parentBuildingId]);

	return (
		<div className='p-4'>
			<h3 className='text-lg font-semibold mb-2'>{parentBuildingName}</h3>
			<div className='grid grid-cols-3 gap-4'>
				{labData.map((lab, index) => (
					<div key={index} className='relative'>
						<LabCard lab={lab} />
					</div>
				))}
			</div>
			<button
				className='text-blue-600 hover:underline mt-4'
				onClick={toggleLabs}
			>
				Back to Buildings
			</button>
		</div>
	);
}
