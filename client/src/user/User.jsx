import { Routes, Route, Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

export default function User() {
  return (
    <div className="block sm:grid grid-cols-5">
      <SideBar />
      <div className="col-span-4">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
