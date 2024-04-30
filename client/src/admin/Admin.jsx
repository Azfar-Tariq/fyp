import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Global/Header";
import SideBar from "./components/Global/Sidebar/SideBar";
import Configuration from "./pages/Configuration";
import Analytics from "./pages/Analytics";
import Areas from "./pages/Areas";
import Camera from "./pages/Cameras";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";

export default function Admin() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = pageTitle;
  }, [location]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/configuration":
        return "Configuration";
      case "/admin/analytics":
        return "Analytics";
      case "/admin/areas":
        return "Areas";
      case "/admin/cameras":
        return "Cameras";
      case "/admin/users":
        return "Users";
      case "/admin/profile":
        return "Profile";
      default:
        break;
    }
  };
  return (
    <div className="flex">
      <div className="w-1/5 fixed">
        <SideBar />
      </div>
      <div className="flex flex-col w-4/5" style={{ marginLeft: "20%" }}>
        <Header className="mb2.5" pageTitle={getPageTitle(location.pathname)} />
        <div className="overflow-auto">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/cameras" element={<Camera />} />
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
