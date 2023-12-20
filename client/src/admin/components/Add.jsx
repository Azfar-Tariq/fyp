import { MaterialSymbolsAddRounded } from "../assets/icons/add";

export default function Add({ toggleDialog, text }) {
	return (
		<div className='mt-4'>
			<button
				className='text-white text-md rounded-lg p-3 text-center inline-flex gap-3 items-center bg-blue-600 hover:bg-blue-700'
				onClick={toggleDialog}
			>
				<MaterialSymbolsAddRounded />
				Add {text}
			</button>
		</div>
	);
}
