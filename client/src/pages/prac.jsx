import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";

export default function Dashboard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [buildingName, setBuildingName] = useState("");
	const [buildingList, setBuildingList] = useState([]);
	const [selectedBuilding, setSelectedBuilding] = useState(null); // Add state to track the selected building

	useEffect(() => {
		Axios.get("http://localhost:3001/read").then((response) => {
			setBuildingList(response.data);
		});
	}, []);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		console.log("Building Name: ", buildingName);
		Axios.post("http://localhost:3001/insert", { buildingName: buildingName });
		setBuildingName("");
		setIsDialogOpen(false);
	};

	// Function to handle selecting a building
	const handleSelectBuilding = (buildingName) => {
		setSelectedBuilding(buildingName);
	};

	// Function to go back to displaying all buildings
	const handleBackToBuildings = () => {
		setSelectedBuilding(null);
	};

	return (
		<div className='col-span-4 px-6 py-4 h-screen flex flex-col '>
			<Header title='Dashboard' />
			<div className='overflow-y-auto'>
				{selectedBuilding === null ? ( // Display all buildings or selected building's labs
					<div className='grid grid-cols-3 gap-4'>
						{buildingList.map((val, index) => (
							<Card
								key={index}
								val={val}
								onSelect={() => handleSelectBuilding(val.buildingName)} // Pass onSelect function to the Card component
							/>
						))}
					</div>
				) : (
					<div>
						<button
							onClick={handleBackToBuildings}
							className='text-blue-500 cursor-pointer'
						>
							Go back to all buildings
						</button>
						{/* Display the Labs component here */}
					</div>
				)}
				<Add toggleDialog={toggleDialog} />
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
