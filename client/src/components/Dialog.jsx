export default function Dialog({
	text,
	text2,
	name,
	setName,
	onClose,
	onSubmit,
}) {
	const handleSave = () => {
		onSubmit();
		setName("");
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
			<div className='relative w-auto max-w-md p-5 mx-auto my-6'>
				<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
					<div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
						<h3 className='text-3xl font-semibold'>{text}</h3>
					</div>
					<div className='relative p-6 flex-auto'>
						<label htmlFor='buildingName'>{`Enter ${text2} Name:`}</label>
						<input
							type='text'
							id='buildingName'
							className='outline-1 border-2 border-black rounded-md p-2 w-full'
							placeholder={`e.g. ${text2} A`}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
						<button
							className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 transition duration-300 ease-in-out hover:text-red-600'
							type='button'
							onClick={onClose}
						>
							Close
						</button>
						<button
							className='bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
							type='button'
							onClick={handleSave}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
