import { useState, useEffect } from "react";
import { MajesticonsAnalytics } from "../../assets/icons/analytics";
import { IconParkOutlineSettingConfig } from "../../assets/icons/config";
import { MaterialSymbolsAccountCircle } from "../../assets/icons/profile";
import { PhUsersBold } from "../../assets/icons/users";

export default function SideBar() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col min-h-screen">
      <div className="flex items-center gap-2 px-1 py-3">
        <span className="text-neutral-200 text-lg">{user.name}</span>
      </div>
      <div className="py-8 flex flex-1 flex-col gap-0.5">
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href={item.dest}
            onClick={() => setSelectedTab(index)}
            className={`flex items-center text-xl p-2  gap-4 text-white hover:bg-gray-700 border-b border-gray-500`}
          >
            {item.img}
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </div>
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
