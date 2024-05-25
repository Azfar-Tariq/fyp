import { useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import sidebarItems from "./SidebarItemsData";

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLast, ChevronFirst } from "lucide-react";

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;

export default function SideBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const get = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email not found in local storage");
        return;
      }

      const response = await fetch(
        `${HOST_ADDRESS}/admin-details?email=${email}`,
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

  useEffect(() => {
    const index = sidebarItems.findIndex(
      (item) => item.dest === location.pathname
    );
    setActiveIndex(index !== -1 ? index : 0);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <aside className="h-screen bg-background shadow-md shadow-black">
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className="text-lg font-semibold text-icon">Logo</span>
          <button
            onClick={toggleMenu}
            className="p-1.5 rounded-lg duration-150 text-icon bg-[#1b1d24] hover:bg-icon hover:text-background"
          >
            {menuOpen ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              active={activeIndex === index}
              onClick={() => {
                setActiveIndex(index);
                navigate(item.dest);
              }}
            ></SidebarItem>
          ))}
        </ul>

        <div className="border-t flex p-4 gap-4">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">{user.name}</h4>
              <span className="text-xs text-white">{user.admin_email}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
