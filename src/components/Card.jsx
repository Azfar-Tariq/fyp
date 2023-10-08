import { MiOptionsVertical } from "../assets/icons/options";
import Image1 from "../assets/images/blockC.jpg";

export default function Card() {
	return (
		<div className='w-80 border rounded-lg shadow bg-gray-800 border-gray-700'>
			<a href='#'>
				<img
					className='rounded-t-lg object-cover w-full h-full'
					src={Image1}
					alt=''
				/>
				<div className='p-4 flex justify-between items-center'>
					<h5 className=' text-xl font-bold tracking-tight text-white'>
						Block C
					</h5>
					<MiOptionsVertical
						color='white'
						className='hover:bg-gray-700 hover:rounded-md'
					/>
				</div>
			</a>
		</div>
	);
}
