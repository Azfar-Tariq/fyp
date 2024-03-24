import { MajesticonsAnalytics } from "../../../assets/icons/analytics";
import { IconParkOutlineSettingConfig } from "../../../assets/icons/config";
import { MaterialSymbolsAccountCircle } from "../../../assets/icons/profile";
import { PhUsersBold } from "../../../assets/icons/users";
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
  export default sidebarItems