import { MiOptionsVertical } from "../assets/icons/options";
import Image2 from "../assets/images/labs/lab1.jpg";

export default function Labs({ parentBuildingName, toggleLabs }) {
	const labData = [
		{ labName: "Lab 1", imageSrc: Image2 },
		{ labName: "Lab 2", imageSrc: Image2 },
		{ labName: "Lab 3", imageSrc: Image2 },
		{ labName: "Lab 4", imageSrc: Image2 },
	];

	return (
		<div className='p-4'>
			<h3 className='text-lg font-semibold mb-2'>{parentBuildingName}</h3>
			<div className='grid grid-cols-3 gap-4'>
				{labData.map((lab, index) => (
					<div
						key={index}
						className='border rounded-lg shadow bg-gray-800 border-gray-700'
					>
						<img
							className='rounded-t-lg object-fit w-full h-full'
							src={lab.imageSrc}
							alt=''
						/>
						<div className='flex justify-between items-center'>
							<p className=' text-xl font-bold tracking-tight text-black'>
								{lab.labName}
							</p>
							<MiOptionsVertical
								color='black'
								className='hover:bg-slate-400 hover:rounded-md'
							/>
						</div>
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
