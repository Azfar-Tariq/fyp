import { Routes, Route, Outlet } from "react-router-dom";
import UserSideBar from "./components/UserSideBar"; // Import UserSidebar
import DashboardUser from "./pages/DashboardUser"; // Import UserDashboardPage
import UserProfile from "./pages/UserProfile"; // Import UserProfilePage
import ErrorPage from "./pages/ErrorPage"; // Import UserErrorPage

function UserDashboard() {
  return (
    <div className="block sm:grid grid-cols-5">
      <UserSideBar />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<DashboardUser />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default UserDashboard;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SideBar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import ErrorPage from "./pages/ErrorPage";

// function UserDashboard() {
// 	return (
// 		<div className='grid grid-cols-5'>
// 			<SideBar />
// 			<Router>
// 				<Routes>
// 					<Route path='/' element={<Dashboard />} />
// 					<Route path='/profile' element={<Profile />} />
// 					<Route path='*' element={<ErrorPage />} />
// 				</Routes>
// 			</Router>
// 		</div>
// 	);
// }

// export default UserDashboard;
