import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

function App() {
	return (
		<div className='grid grid-cols-5'>
			<SideBar />
			<Router>
				<Routes>
					<Route path='/' element={<Dashboard />} />
					<Route path='/analytics' element={<Analytics />} />
					<Route path='/users' element={<Users />} />
					<Route path='/profile' element={<Profile />} />
					<Route path='*' element={<ErrorPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
