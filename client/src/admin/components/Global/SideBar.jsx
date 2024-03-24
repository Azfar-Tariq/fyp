
import { useState, useEffect } from "react";
import { MajesticonsAnalytics } from "../../assets/icons/analytics";
import { IconParkOutlineSettingConfig } from "../../assets/icons/config";
import { MaterialSymbolsAccountCircle } from "../../assets/icons/profile";
import { PhUsersBold } from "../../assets/icons/users";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
export default function SideBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <aside
      className={`h-screen bg-white border-r shadow-sm transition-all`}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className="text-lg font-semibold">Your Logo Here</span>
          <button
            onClick={toggleMenu}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {menuOpen ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} item={item} active={index === 0} /> // Assuming first item is active
          ))}
        </ul>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user.name}</h4>
              <span className="text-xs text-gray-600">
                {user.email}
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ item, active }) {
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {item.img}
      <span
        className={`overflow-hidden transition-all `}
      >
        {item.name}
      </span>
    </li>
  );
}

const sidebarItems = [
  {
    name: "Dashboard",
    img: <MajesticonsAnalytics />,
    dest: "/admin",
  },
  {
    name: "Configuration",
    img: <IconParkOutlineSettingConfig />,
    dest: "/admin/configuration",
  },
  {
    name: "Analytics",
    img: <MajesticonsAnalytics />,
    dest: "/admin/analytics",
  },
  {
    name: "Areas",
    img: <MajesticonsAnalytics />,
    dest: "/admin/areas",
  },
  {
    name: "Cameras",
    img: <MajesticonsAnalytics />,
    dest: "/admin/cameras",
  },
  {
    name: "Users",
    img: <PhUsersBold />,
    dest: "/admin/users",
  },
  {
    name: "Profile",
    img: <MaterialSymbolsAccountCircle />,
    dest: "/admin/profile",
  },
];
