import { Routes, Route, Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

export default function Admin() {
  return (
    <div className="block sm:grid grid-cols-5">
      <SideBar className="w-64" />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
