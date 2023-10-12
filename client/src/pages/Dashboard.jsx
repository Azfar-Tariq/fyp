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
	const [labName, setLabName] = useState("");
	const [buildingList, setBuildingList] = useState([]);
	const [selectedBuildingId, setSelectedBuildingId] = useState(null);
	const [selectedBuildingName, setSelectedBuildingName] = useState("");
	const [addButtonText, setAddButtonText] = useState("Building");
	const [isAddingLab, setIsAddingLab] = useState(false);

	useEffect(() => {
		Axios.get("http://localhost:3001/readBuilding").then((response) => {
			setBuildingList(response.data);
		}, []);
	});

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		if (isAddingLab) {
			console.log("Lab Name: ", labName);
			Axios.post(
				`http://localhost:3001/readBuidling/${selectedBuildingId}/addLab`,
				{
					labName: labName,
				}
			)
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.error("Failed to save lab:", error);
				});
		} else {
			console.log("Building Name: ", buildingName);
			Axios.post("http://localhost:3001/insertBuilding", {
				buildingName: buildingName,
			})
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.error("Failed to save building:", error);
				});
		}
		setIsDialogOpen(false);
	};

	const handleSelectBuilding = (buildingId, buildingName) => {
		setSelectedBuildingId(buildingId);
		setSelectedBuildingName(buildingName);
		setAddButtonText("Lab");
		setIsAddingLab(true);
	};

	const handleBackToBuildings = () => {
		setSelectedBuildingId(null);
		setSelectedBuildingName("");
		setAddButtonText("Building");
		setIsAddingLab(false);
	};

	return (
		<div className='col-span-4 px-6 py-4 h-screen flex flex-col'>
			<Header title='Dashboard' />
			<div className='overflow-y-auto'>
				{selectedBuildingId === null ? (
					<div className='grid grid-cols-3 gap-4'>
						{buildingList.map((val, index) => (
							<Card
								key={index}
								val={val}
								onSelect={() => handleSelectBuilding(val._id, val.buildingName)}
							/>
						))}
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
				<Add toggleDialog={toggleDialog} text={addButtonText} />
				{isDialogOpen && (
					<Dialog
						text={`Add ${selectedBuildingId ? "Lab" : "Building"}`}
						buildingName={selectedBuildingId ? labName : buildingName}
						setBuildingName={selectedBuildingId ? setLabName : setBuildingName}
						onClose={toggleDialog}
						onSubmit={handleSubmitDialog}
						isAddingLab={selectedBuildingId}
					/>
				)}
			</div>
		</div>
	);
}
