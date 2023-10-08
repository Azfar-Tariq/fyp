import Card from "../components/Card";
import Header from "../components/Header";

export default function Dashboard() {
	return (
		<div className='col-span-4 px-6 py-4'>
			<Header title='Dashboard' />
			<Card />
		</div>
	);
}
