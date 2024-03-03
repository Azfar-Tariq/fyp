import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Global/Header";
import SideBar from "./components/Global/SideBar";
import Configuration from "./pages/Configuration";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

export default function Admin() {
  return (
    <div className="flex h-screen bg-gray-200">
      <SideBar className="h-full" />
      <div className="flex flex-col w-full">
        <Header className="mb2.5" />
        <div className="overflow-auto">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/" element={<Analytics />} />
              <Route path="configuration" element={<Configuration />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
