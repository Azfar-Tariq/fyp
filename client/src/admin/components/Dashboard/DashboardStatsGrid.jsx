import { IoSettings } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { IoPeople } from "react-icons/io5";
import { MaterialSymbolsArrowForwardIosRounded } from "../../assets/icons/forward";
import { MaterialSymbolsAndroidCamera } from "../../assets/icons/camera";
import Chart from "chart.js/auto";
import { MajesticonsMapMarkerArea } from "../../assets/icons/area";
import { Link } from "react-router-dom";
import Axios from "axios";

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;

export default function DashboardStatsGrid() {
  const [users, setUsers] = useState(0);
  const [areas, setAreas] = useState(0);
  const [cameras, setCameras] = useState(0);

  useEffect(() => {
    Axios.get(`${HOST_ADDRESS}/users`)
      .then((res) => {
        setUsers(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Users:", err);
      });

    Axios.get(`${HOST_ADDRESS}/readArea`)
      .then((res) => {
        setAreas(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Areas:", err);
      });

    Axios.get(`${HOST_ADDRESS}/readAllCameras`)
      .then((res) => {
        setCameras(res.data.length);
      })
      .catch((err) => {
        console.error("Failed to get Cameras:", err);
      });
  }, []);

  return (
    <div className="bg-primary">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        <DashboardBox
          icon={<IoPeople className="text-6xl p-0 m-0 text-icon" />}
          title="Users"
          value={users}
          link="/admin/users"
          color="bg-background"
          description="Manage user accounts and permissions."
        />
        <DashboardBox
          icon={
            <MajesticonsMapMarkerArea
              size="4rem"
              className="text-6xl p-0 m-0 text-icon"
            />
          }
          title="Areas"
          value={areas}
          link="/admin/areas"
          color="bg-background"
          description="View, edit, and monitor surveillance areas."
        />
        <DashboardBox
          icon={
            <MaterialSymbolsAndroidCamera
              size="4rem"
              className="text-6xl p-0 m-0 text-icon"
            />
          }
          title="Cameras"
          value={cameras}
          link="/admin/cameras"
          color="bg-background"
          description="Monitor live camera feeds and recordings."
        />
        <DashboardBox
          icon={<IoSettings className="text-6xl p-0 m-0 text-icon" />}
          title="Configuration"
          link="/admin/configuration"
          color="bg-background"
          description="Manage user accounts and permissions."
        />
      </div>
      <div className="mx-6 mb-4">
        <AnalyticsGraph />
      </div>
    </div>
  );
}

function AnalyticsGraph() {
  const chartRef = useRef(null);
  const DATA_LIMIT = 10;

  useEffect(() => {
    const ctx = document.getElementById("analyticsChart").getContext("2d");
    const initialData = {
      labels: [], // This will be updated dynamically
      datasets: [
        {
          label: "Electric Current",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
        {
          label: "Voltage",
          data: [],
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
          fill: false,
        },
        {
          label: "Power",
          data: [],
          borderColor: "rgb(54, 162, 235)",
          tension: 0.1,
          fill: false,
        },
      ],
    };

    const chartInstance = new Chart(ctx, {
      type: "line",
      data: initialData,
    });

    chartRef.current = chartInstance;

    return () => {
      chartInstance.destroy(); // Clean up chart instance on component unmount
    };
  }, []);

  useEffect(() => {
    const fetchData = () => {
      Axios.get(`${HOST_ADDRESS}/recvStats`)
        .then((res) => {
          const dataPoint = res.data[0]; // Assuming the API returns an array of data points
          const { ElectricCurrent, Voltage, Power } = dataPoint;

          const chart = chartRef.current;
          if (chart) {
            const now = new Date().toLocaleTimeString();
            if (chart.data.labels.length < DATA_LIMIT) {
              chart.data.labels.push(now);
              chart.data.datasets[0].data.push(ElectricCurrent);
              chart.data.datasets[1].data.push(Voltage);
              chart.data.datasets[2].data.push(Power);
              chart.update();
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch data:", err);
        });
    };

    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    // Initial fetch
    fetchData();

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div className="bg-gray-800 w-full col-span-4 rounded-lg p-6 text-white">
      <h2 className="text-xl font-semibold mb-2">Analytics</h2>
      <canvas id="analyticsChart" width="400" height="200"></canvas>
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
          <p className="text-white text-4xl m-2">{value}</p>
        </div>

        <p className="text-white text-sm mt-2">{description}</p>
        <button className="flex items-center text-white text-sm mt-2 focus:outline-none">
          See More
          <MaterialSymbolsArrowForwardIosRounded className="ml-2" />
        </button>
        {/*<div className="mt-4 border-t border-gray-300 pt-4">
          <p className="text-xs text-white">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>*/}
      </div>
    </Link>
  );
}
