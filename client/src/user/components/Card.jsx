import { ToastContainer } from "react-toastify";

export default function Card({ val, onSelect }) {

	return (
		<div>
			<ToastContainer />
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'
				onClick={() => onSelect(val.id, val.buildingName)}
			>
				<div className='p-4 flex justify-between items-center'>
					<p className=' text-xl font-bold tracking-tight text-white'>
						{val.buildingName}
					</p>
					
				</div>
			</div>
			
		</div>
	);
}