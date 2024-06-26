import { useState } from "react";
import { MaterialSymbolsHome } from "../assets/icons/home";
import { CiHamburgerLg } from "../assets/icons/menu";
import { MaterialSymbolsAccountCircle } from "../assets/icons/profile";
import logo from "../assets/logo/logo2.jpeg";
import { MaterialSymbolsClose } from "../assets/icons/close";
import { MaterialSymbolsSearch } from "../assets/icons/search";
import { MaterialSymbolsNotifications } from "../assets/icons/notification";

export default function UserSideBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="sm:hidden p-6 flex items-center justify-between">
        <div
          className="bg-gray-800 p-2 rounded-lg inline-block"
          onClick={toggleMenu}
        >
          {menuOpen ? <MaterialSymbolsClose /> : <CiHamburgerLg />}
        </div>
        <div>
          <img src={logo} className="h-16 w-16" alt="Logo" />
        </div>
        <div className="flex p-2 gap-2">
          <MaterialSymbolsSearch />
          <MaterialSymbolsNotifications />
        </div>
        {menuOpen && (
          <div className="absolute mt-[21rem] bg-gray-800 p-2 rounded-lg z-10">
            <ul className="space-y-4 font-medium">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.dest}
                    className="flex items-center text-xl p-2 rounded-lg gap-4 text-white"
                  >
                    {item.img}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="hidden sm:block">
        <aside className="top-0 left-0 z-40 w-full h-screen">
          <div className="h-full px-4 py-4 flex flex-col bg-gray-800">
            <div className="flex items-center gap-6 p-4">
              <img src={logo} className="h-6" alt="Logo" />
              <span className="self-center text-xl font-semibold text-white">
                LOGO
              </span>
            </div>
            <ul className="space-y-4 font-medium">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.dest}
                    className="flex items-center text-xl p-2 rounded-lg gap-4 text-white hover:bg-gray-700"
                  >
                    {item.img}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

const sidebarItems = [
  { name: "Dashboard", img: <MaterialSymbolsHome />, dest: "/user" },

  {
    name: "Profile",
    img: <MaterialSymbolsAccountCircle />,
    dest: "/user/profile",
  },
];
