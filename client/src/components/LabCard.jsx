import { useState } from "react";
import { MiOptionsVertical } from "../assets/icons/options";

export default function LabCard({ lab }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className='border rounded-lg shadow bg-gray-800 border-gray-700'>
			<img
				className='rounded-t-lg object-fit w-full h-40'
				src={lab.imageSrc}
				alt=''
			/>
			<div className='flex justify-between items-center p-4'>
				<p className='text-xl font-bold tracking-tight text-white'>
					{lab.labName}
				</p>
				<MiOptionsVertical
					color='white'
					className='hover:bg-slate-400 hover:rounded-md'
					onClick={toggleMenu}
				/>
			</div>
			{isMenuOpen && (
				<div className='absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-24'>
					<ul>
						<li>
							<button
								className='block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left'
								onClick={closeMenu}
							>
								Edit
							</button>
						</li>
						<li>
							<button
								className='block px-4 py-2 text-red-600 hover:bg-red-200 w-full text-left'
								onClick={() => {
									closeMenu();
								}}
							>
								Delete
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
