/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";
import Labs from "../components/Labs";

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
			<div className='overflow-y-auto'>
				{selectedBuildingId === null ? (
					<div>
						<div className='grid grid-cols-3 gap-4'>
							{buildingList.map((val, index) => (
								<div key={index}>
									<Card
										val={val}
										image={`http://localhost:3001/${val.buildingImage}`}
										updatedBuildingData={updatedBuildingData}
										onSelect={() =>
											handleSelectBuilding(val._id, val.buildingName)
										}
									/>
								</div>
							))}
						</div>
						<Add toggleDialog={toggleDialog} text='Building' />
						{isDialogOpen && (
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
						)}
					</div>
				) : (
					<div>
						<Labs
							parentBuildingId={selectedBuildingId}
							parentBuildingName={selectedBuildingName}
							toggleLabs={handleBackToBuildings}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
