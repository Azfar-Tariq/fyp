import { useState, useEffect } from "react";
import { MajesticonsAnalytics } from "../../assets/icons/analytics";
import { IconParkOutlineSettingConfig } from "../../assets/icons/config"
import { MaterialSymbolsAccountCircle } from "../../assets/icons/profile";
import { PhUsersBold } from "../../assets/icons/users";

export default function SideBar() {
  const [user, setUser] = useState({ name: "", email: "" });

  const get = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email not found in local storage");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/user-details?email=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <div className="p-3 bg-purple-50 border border-gray-200 flex flex-col h-[600px] m-4 rounded-lg">
      <div className="flex justify-center items-center gap-2 px-1 py-3">
        <span className="text-black text-lg">LOGO</span>
      </div>
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href={item.dest}
            className="border border-purple-400 hover:border-purple-700 flex flex-col items-center m-2 py-4 rounded-xl hover:scale-105 group transition duration-300 ease-in-out"
          >
            <p className="m-2 text-black group-hover:text-purple-700">
              {item.img}
            </p>
            <span className="text-black text-base group-hover:text-purple-700">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

const sidebarItems = [
  {
    name: "Dashboard",
    img: <MaterialSymbolsAccountCircle />,
    dest: "/user",
  },
  {
    name: "Manual Control",
    img: <IconParkOutlineSettingConfig />,
    dest: "/user/manual-Control",
  },
];
