import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";
import Labs from "../components/Labs";

export default function Dashboard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [buildingName, setBuildingName] = useState("");
	const [buildingList, setBuildingList] = useState([]);
	const [selectedBuilding, setSelectedBuilding] = useState(null);

	useEffect(() => {
		Axios.get("http://localhost:3001/read").then((response) => {
			setBuildingList(response.data);
		}, []);
	});

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		console.log("Building Name: ", buildingName);
		Axios.post("http://localhost:3001/insert", { buildingName: buildingName });
		setIsDialogOpen(false);
	};

	const handleSelectBuilding = (buildingName) => {
		setSelectedBuilding(buildingName);
	};

	const handleBackToBuildings = () => {
		setSelectedBuilding(null);
	};

	return (
		<div className='col-span-4 px-6 py-4 h-screen flex flex-col '>
			<Header title='Dashboard' />
			<div className='overflow-y-auto'>
				{selectedBuilding === null ? (
					<div className='grid grid-cols-3 gap-4'>
						{buildingList.map((val, index) => (
							<Card
								key={index}
								val={val}
								onSelect={() => handleSelectBuilding(val.buildingName)}
							/>
						))}
					</div>
				) : (
					<div>
						<Labs
							parentBuildingName={selectedBuilding}
							toggleLabs={handleBackToBuildings}
						/>
					</div>
				)}
				<Add toggleDialog={toggleDialog} className='mt-6' />
				{isDialogOpen && (
					<Dialog
						text='Add'
						buildingName={buildingName}
						setBuildingName={setBuildingName}
						onClose={toggleDialog}
						onSubmit={handleSubmitDialog}
					/>
				)}
			</div>
		</div>
	);
}
