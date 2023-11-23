/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";
import Labs from "../components/Labs";
import { ToastContainer, toast } from "react-toastify";
import ModalOverlay from "../components/ModalOverlay";
import { PulseLoader } from "react-spinners";

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
	const [buildingList, setBuildingList] = useState([]);
	const [selectedBuildingId, setSelectedBuildingId] = useState(null);
	const [selectedBuildingName, setSelectedBuildingName] = useState("");
	const [loading, setLoading] = useState(false);

	const updatedBuildingData = () => {
		fetchData(setBuildingList);
	};

	useEffect(() => {
		setLoading(true);
		Axios.get("http://localhost:3001/readBuilding")
			.then((response) => {
				setBuildingList(response.data);
				setLoading(false);
			}, [])
			.catch((err) => {
				console.error("Failed to get buildings:", err);
				setLoading(false);
			});
	}, []);

	const toggleDialog = () => {
		setIsDialogOpen(!isDialogOpen);
	};

	const handleSubmitDialog = () => {
		Axios.post("http://localhost:3001/insertBuilding", {
			buildingName: buildingName,
		})
			.then((response) => {
				console.log(response.data);
				updatedBuildingData();
				toast.success("Building added successfully");
			})
			.catch((error) => {
				console.error("Failed to save building:", error);
			});
		setIsDialogOpen(false);
		setBuildingName("");
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
			<ToastContainer />
			<div className='overflow-y-auto'>
				{selectedBuildingId === null ? (
					<div>
						<div className='mb-2'>
							<a className='text-lg font-semibold'>Buildings</a>
						</div>
						{loading && (
							<div>
								<PulseLoader />
							</div>
						)}
						{buildingList.length === 0 ? (
							<p>No Buildings currently</p>
						) : (
							<div className='grid grid-cols-3 gap-4'>
								{buildingList.map((val, index) => (
									<div key={index} className='relative'>
										<Card
											val={val}
											updatedBuildingData={updatedBuildingData}
											onSelect={() =>
												handleSelectBuilding(val.id, val.buildingName)
											}
										/>
									</div>
								))}
							</div>
						)}
						<Add toggleDialog={toggleDialog} text='Building' />
						{isDialogOpen && (
							<ModalOverlay isOpen={isDialogOpen}>
								<Dialog
									text='Add Building'
									text2='Building'
									name={buildingName}
									setName={setBuildingName}
									onClose={toggleDialog}
									onSubmit={handleSubmitDialog}
								/>
							</ModalOverlay>
						)}
					</div>
				) : (
					<div>
						<Labs
							parentBuildingId={selectedBuildingId}
							parentBuildingName={selectedBuildingName}
							backToBuildings={handleBackToBuildings}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
