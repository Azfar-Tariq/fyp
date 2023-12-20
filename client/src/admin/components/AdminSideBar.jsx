import { MajesticonsAnalytics } from "../assets/icons/analytics";
import { MaterialSymbolsHome } from "../assets/icons/home";
import { MaterialSymbolsAccountCircle } from "../assets/icons/profile";
import { PhUsersBold } from "../assets/icons/users";
import logo from "../assets/logo/logo2.jpeg";

export default function SideBar() {
  return (
    <div>
      <aside className="top-0 left-0 z-40 w-full h-screen">
        <div className="h-full px-4 py-4 flex flex-col bg-gray-800">
          <div className="flex items-center gap-6 p-4">
            <img src={logo} className="h-6 sm:h-10" alt="Logo" />
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
  );
}

const sidebarItems = [
  { name: "Dashboard", img: <MaterialSymbolsHome />, dest: "/admin" },
  {
    name: "Analytics",
    img: <MajesticonsAnalytics />,
    dest: "/admin/analytics",
  },
  { name: "Users", img: <PhUsersBold />, dest: "/admin/users" },
  {
    name: "Profile",
    img: <MaterialSymbolsAccountCircle />,
    dest: "/admin/profile",
  },
];
