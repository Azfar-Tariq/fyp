import { MaterialSymbolsNotifications } from "../assets/icons/notification";
import { MaterialSymbolsSearch } from "../assets/icons/search";
import PropTypes from "prop-types";

export default function Header(props) {
	return (
		<div className='flex items-center justify-between p-3'>
			<p className='font-semibold text-2xl'>{props.title}</p>
			<div className='flex gap-2 items-center'>
				<div className='border-2 rounded-xl flex py-2 px-4 items-center'>
					<input type='text' placeholder='Search' className='outline-0' />
					<MaterialSymbolsSearch color='#121856' />
				</div>
				<MaterialSymbolsNotifications color='#121856' />
			</div>
		</div>
	);
}

Header.propTypes = {
	title: PropTypes.string.isRequired,
};
