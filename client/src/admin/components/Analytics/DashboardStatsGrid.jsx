import { useEffect, useState } from "react";
import { IoPeople, IoMap, IoCamera } from "react-icons/io5";
import Axios from "axios";

export default function DashboardStatsGrid() {
  const [users, setUsers] = useState(0);
  const [areas, setAreas] = useState(0);
  const [cameras, setCameras] = useState(0);

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
    <div className="flex gap-4 m-5">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-500">
          <IoPeople className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Users</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {users}
            </strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500">
          <IoMap className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Areas</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {areas}
            </strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-500">
          <IoCamera className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Cameras</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {cameras}
            </strong>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
}

function BoxWrapper({ children }) {
  return (
    <div className="bg-purple-50 rounded-md p-4 flex-1 border border-gray-300 shadow-md transform transition-transform duration-200 hover:scale-105 flex items-center">
      {children}
    </div>
  );
}
