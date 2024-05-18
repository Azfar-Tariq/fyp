import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import SideBar from "./components/Global/User_Sidebar/SideBar";
import Header from "./components/Global/Header";
import ManualControl from "./pages/ManualControl";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import { useEffect } from "react";

export default function User() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = pageTitle;
  }, [location]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/user":
        return "Profile";
      case "/user/manual-Control":
        return "Manual Control";
      default:
        break;
    }
  };

  return (
    <div className="flex bg-primary min-h-screen">
      <div className="w-1/5 fixed">
        <SideBar />
      </div>
      <div className="flex flex-col w-4/5" style={{ marginLeft: "20%" }}>
        <Header className="mb2.5" pageTitle={getPageTitle(location.pathname)} />
        <div className="overflow-auto">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/" element={<Profile />} />
              <Route path="manual-Control" element={<ManualControl />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
