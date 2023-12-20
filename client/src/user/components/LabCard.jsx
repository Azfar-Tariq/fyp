/* eslint-disable no-unused-vars */
import { ToastContainer } from "react-toastify";

export default function LabCard({
	val,
	onSelect,
}) {
	return (
		<div>
			<ToastContainer />
			<div
				className='border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer'
				onClick={() => onSelect(val.id, val.labName)}
			>
				<div className='flex justify-between items-center p-4'>
					<p className='text-xl font-bold tracking-tight text-white'>
						{val.labName}
					</p>
					
				</div>
			</div>
		
		</div>
	);
}
