// AdminDashboard.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import AdminSideBar from "./components/AdminSideBar";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminAnalytics from "./pages/AdminAnalytics"; // Import admin analytics
import AdminUsers from "./pages/Users";
import AdminProfile from "./pages/AdminProfile";
import ErrorPage from "./pages/ErrorPage";


function AdminDashboard() {
  return (
    <div className='grid grid-cols-5'>
      <AdminSideBar /> {/* Use AdminSidebar instead of SideBar */}
      <div className='col-span-4'>
        <Routes>
          <Route path="/" element={<Outlet />}>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;






// import { Routes, Route } from "react-router-dom";
// import SideBar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Analytics from "./pages/Analytics";
// import Users from "./pages/Users";
// import Profile from "./pages/Profile";
// import ErrorPage from "./pages/ErrorPage";

// function AdminDashboard() {
//   return (
//     <div className='grid grid-cols-5'>
//       <SideBar />
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/analytics" element={<Analytics />} />
//         <Route path="/users" element={<Users />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="*" element={<ErrorPage />} />
//         {/* Redirect to Dashboard if no sub-route matches */}
        
//       </Routes>
//     </div>
//   );
// }

// export default AdminDashboard;





// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import SideBar from "./components/Sidebar";
// // import Dashboard from "./pages/Dashboard";
// // import Analytics from "./pages/Analytics";
// // import Users from "./pages/Users";
// // import Profile from "./pages/Profile";
// // import ErrorPage from "./pages/ErrorPage";

// // function AdminDashboard() {
// // 	return (
// // 		<div className='grid grid-cols-5'>
// // 			<SideBar />
// // 			<Router>
// // 				<Routes>
// // 					<Route path='/' element={<Dashboard />} />
// // 					<Route path='/analytics' element={<Analytics />} />
// // 					<Route path='/users' element={<Users />} />
// // 					<Route path='/profile' element={<Profile />} />
// // 					<Route path='*' element={<ErrorPage />} />
// // 				</Routes>
// // 			</Router>
// // 		</div>
// // 	);
// // }

// // export default AdminDashboard;