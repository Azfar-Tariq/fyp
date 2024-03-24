import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Global/Header";
import SideBar from "./components/Global/Sidebar/SideBar";
import Configuration from "./pages/Configuration";
import Analytics from "./pages/Analytics";
import Areas from "./pages/Areas";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";

export default function Admin() {
  return (
    <div className="flex">
      <div className="w-1/5 fixed">
        <SideBar />
      </div>
      <div className="flex flex-col w-4/5" style={{ marginLeft: "20%" }}>
        <Header className="mb2.5" />
        <div className="overflow-auto">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/areas" element={<Areas />} />
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
