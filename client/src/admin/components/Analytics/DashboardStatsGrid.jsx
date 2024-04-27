import { Link } from "react-router-dom";
import { IoBarChart, IoSettings } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoPeople } from "react-icons/io5";
import { MaterialSymbolsArrowForwardIosRounded } from "./../../assets/icons/forward";
import { MaterialSymbolsAndroidCamera } from "./../../assets/icons/camera";
import Chart from "chart.js/auto";
import Axios from "axios";
import { MajesticonsMapMarkerArea } from "../../assets/icons/area";

export default function DashboardStatsGrid() {
  const [users, setUsers] = useState(0);
  const [areas, setAreas] = useState(0);
  const [cameras, setCameras] = useState(0);

  useEffect(() => {
    // Dummy data for the line graph
    const data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Sales",
          data: [12, 19, 3, 5, 2, 3, 15, 17, 8, 2, 10, 15],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    // Creating the line graph
    const ctx = document.getElementById("analyticsChart");
    let chartInstance = new Chart(ctx, {
      type: "line",
      data: data,
    });

    return () => {
      chartInstance.destroy(); // Destroy the chart instance when the component unmounts
    };
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/users")
      .then((res) => {
        setUsers(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Users:", err);
      });

    Axios.get("http://localhost:3001/readArea")
      .then((res) => {
        setAreas(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Areas:", err);
      });

    Axios.get("http://localhost:3001/readAllCameras")
      .then((res) => {
        setCameras(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Cameras:", err);
      });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <DashboardBox
          icon={<IoPeople className="text-6xl p-0 m-0 text-white" />}
          title="Users"
          value={users}
          link="/admin/users"
          color="bg-blue-500"
          description="Manage user accounts and permissions."
        />
        <DashboardBox
          icon={
            <MajesticonsMapMarkerArea className="text-6xl p-0 m-0 text-white" />
          }
          title="Areas"
          value={areas}
          link="/admin/areas"
          color="bg-green-500"
          description="View, edit, and monitor surveillance areas."
        />
        <DashboardBox
          icon={
            <MaterialSymbolsAndroidCamera className="text-6xl p-0 m-0 text-white" />
          }
          title="Cameras"
          value={cameras}
          link="/admin/cameras"
          color="bg-yellow-500"
          description="Monitor live camera feeds and recordings."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        <SidebarItem
          title="Configuration"
          link="/admin/configuration"
          description="Manage system configurations"
        />
        <div className="col-span-2">
          <AnalyticsGraph />
        </div>
      </div>
    </div>
  );
}

function AnalyticsGraph() {
  const [selectedInterval, setSelectedInterval] = useState("daily");

  // Function to handle interval change
  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h2 className="text-xl font-semibold mb-2">Analytics</h2>
      <canvas id="analyticsChart" width="400" height="200"></canvas>
      <div className="mt-4">
        <select
          value={selectedInterval}
          onChange={handleIntervalChange}
          className="text-white bg-gray-700 px-3 py-1 rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Link to="/admin/analytics" className="text-sm mt-2">
        Click to navigate
      </Link>
    </div>
  );
}

function DashboardBox({ icon, title, value, link, color, description }) {
  return (
    <Link to={link}>
      <div
        className={`rounded-lg p-6 ${color} hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1`}
      >
        <div className="flex justify-between">
          <div className="block">
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4">
              {icon}
            </div>
            <h2 className="text-2xl text-white font-semibold mb-2">{title}</h2>
          </div>
          <p className="text-gray-200 text-4xl m-2">{value}</p>
        </div>
        <p className="text-gray-200 text-sm mt-2">{description}</p>
        <button className="flex items-center text-blue-300 text-sm mt-2 focus:outline-none hover:text-blue-400">
          See More
          <MaterialSymbolsArrowForwardIosRounded className="ml-2" />
        </button>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <p className="text-xs text-gray-800">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SidebarItem({ title, link, description }) {
  return (
    <Link to={link}>
      <div className="bg-gray-800 rounded-lg p-6 text-white hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1">
        {title === "Analytics" ? (
          <IoBarChart className="text-5xl mb-4" />
        ) : null}
        {title === "Configuration" ? (
          <IoSettings className="text-5xl mb-4" />
        ) : null}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm">{description}</p>
        <p className="text-sm mt-2">Click to navigate</p>
      </div>
    </Link>
  );
}
