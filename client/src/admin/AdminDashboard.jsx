import { Routes, Route, Outlet } from "react-router-dom";
import AdminSideBar from "./components/AdminSideBar";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminAnalytics from "./pages/AdminAnalytics"; // Import admin analytics
import AdminUsers from "./pages/Users";
import AdminProfile from "./pages/AdminProfile";
import ErrorPage from "./pages/ErrorPage";

function AdminDashboard() {
  return (
    <div className="grid grid-cols-5">
      <AdminSideBar />
      <div className="col-span-4">
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
