import { useEffect, useState } from "react";
import Header from "../components/Header";
import Axios from "axios";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";
import { PulseLoader } from "react-spinners";

export default function Analytics() {
	const [buildingList, setBuildingList] = useState([]);
	const [labList, setLabList] = useState([]);
	const [pcList, setPcList] = useState([]);
	const [selectedBuildingId, setSelectedBuildingId] = useState(null);
	const [selectedLabId, setSelectedLabId] = useState(null);
	const [selectedBuildingName, setSelectedBuildingName] = useState("");
	const [selectedLabName, setSelectedLabName] = useState("");
	const [selectedPcName, setSelectedPcName] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		Axios.get("http://localhost:3001/readBuilding")
			.then((res) => {
				setBuildingList(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to get buildings:", err);
				setLoading(false);
			});
	}, []);

	const fetchLabData = (buildingId, buildingName) => {
		Axios.get(`http://localhost:3001/readBuilding/${buildingId}/readLab`)
			.then((res) => {
				setLabList(res.data);
				setSelectedBuildingId(buildingId);
				setSelectedLabId(null);
				setSelectedBuildingName(buildingName);
				setSelectedLabName("");
				setSelectedPcName("");
			})
			.catch((err) => {
				console.error("Failed to get labs:", err);
			});
	};

	const fetchPcData = (labId, labName) => {
		Axios.get(
			`http://localhost:3001/readBuilding/${selectedBuildingId}/readLab/${labId}/readPc`
		)
			.then((res) => {
				setPcList(res.data);
				setSelectedLabId(labId);
				setSelectedLabName(labName);
				setSelectedPcName("");
			})
			.catch((err) => {
				console.error("Failed to get PCs:", err);
			});
	};

	const handleBuildingClick = (buildingId, buildingName) => {
		if (buildingId === selectedBuildingId) {
			setSelectedBuildingId(null);
			setSelectedLabId(null);
			setSelectedLabName("");
			setSelectedPcName("");
		} else {
			fetchLabData(buildingId, buildingName);
		}
	};

	const handleLabClick = (labId, labName) => {
		if (labId === selectedLabId) {
			setSelectedLabId(null);
			setSelectedPcName("");
		} else {
			fetchPcData(labId, labName);
		}
	};

	const handlePcClick = (pcName) => {
		setSelectedPcName(pcName);
	};

	return (
		<div className='col-span-4 px-6 py-4 h-screen'>
			<Header title='Analytics' />

			<div className='flex'>
				<div className='flex flex-col w-72'>
					{loading && (
						<div>
							<PulseLoader />
						</div>
					)}
					<ul>
						{buildingList.map((building, buildingIndex) => (
							<li key={buildingIndex} className='bg-gray-800 p-2'>
								<a
									className='flex items-center text-xl p-2 gap-4 text-white border border-white cursor-pointer'
									onClick={() =>
										handleBuildingClick(building._id, building.buildingName)
									}
								>
									{building._id === selectedBuildingId ? (
										<IcOutlineKeyboardArrowDown />
									) : (
										<MaterialSymbolsArrowForwardIosRounded />
									)}
									<span>{building.buildingName}</span>
								</a>
								{building._id === selectedBuildingId && (
									<ul className='ml-4'>
										{labList.map((lab, labIndex) => (
											<li key={labIndex} className='p-2'>
												<a
													className='flex items-center text-xl p-2 gap-4 text-white border border-white cursor-pointer'
													onClick={() => handleLabClick(lab._id, lab.labName)}
												>
													{lab._id === selectedLabId ? (
														<IcOutlineKeyboardArrowDown />
													) : (
														<MaterialSymbolsArrowForwardIosRounded />
													)}
													<span>{lab.labName}</span>
												</a>
												{lab._id === selectedLabId && (
													<ul className='ml-4'>
														{pcList.map((pc, pcIndex) => (
															<li key={pcIndex} className='p-2'>
																<a
																	className='flex items-center text-xl p-2 gap-4 text-white border border-white cursor-pointer'
																	onClick={() => handlePcClick(pc.pcName)}
																>
																	<span>{pc.pcName}</span>
																</a>
															</li>
														))}
													</ul>
												)}
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
				<div className='p-4'>
					{selectedBuildingName && (
						<div>
							<strong>Selected Building: </strong> {selectedBuildingName}
						</div>
					)}
					{selectedLabName && (
						<div>
							<strong>Selected Lab: </strong> {selectedLabName}
						</div>
					)}
					{selectedPcName && (
						<div>
							<strong>Selected PC: </strong> {selectedPcName}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
