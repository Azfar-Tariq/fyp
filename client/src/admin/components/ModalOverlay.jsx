const ModalOverlay = ({ isOpen, children }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-x-hidden overflow-y-auto'>
			{children}
		</div>
	);
};

export default ModalOverlay;