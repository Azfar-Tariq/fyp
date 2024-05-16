import { Routes, Route, Outlet } from "react-router-dom";
import SideBar from "./components/Global/User_Sidebar/SideBar";
import Header from "./components/Global/Header";
import ManualControl from "./pages/ManualControl";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";

export default function User() {
  return (
    <div className="flex">
      <div className="w-[14%] fixed">
        <SideBar />
      </div>
      <div className="flex flex-col w-[86%]" style={{ marginLeft: "14%" }}>
        <Header className="mb2.5" />
        <div className="overflow-auto">
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="/" element={<Profile />} />
              <Route path="manual-Control" element={<ManualControl/>} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
