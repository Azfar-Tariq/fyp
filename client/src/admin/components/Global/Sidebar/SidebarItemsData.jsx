import { TablerLayoutDashboardFilled } from "../../../assets/icons/dashboard";
import { IconParkOutlineSettingConfig } from "../../../assets/icons/config";
import { CarbonAnalytics } from "../../../assets/icons/analytics";
import { MajesticonsMapMarkerArea } from "../../../assets/icons/area";
import { MaterialSymbolsAndroidCamera } from "../../../assets/icons/camera";
import { PhUsersBold } from "../../../assets/icons/users";
import { MaterialSymbolsAccountCircle } from "../../../assets/icons/profile";
const sidebarItems = [
  {
    name: "Dashboard",
    img: <TablerLayoutDashboardFilled />,
    dest: "/admin",
  },
  {
    name: "Configuration",
    img: <IconParkOutlineSettingConfig />,
    dest: "/admin/configuration",
  },
  {
    name: "Analytics",
    img: <CarbonAnalytics />,
    dest: "/admin/analytics",
  },
  {
    name: "Areas",
    img: <MajesticonsMapMarkerArea />,
    dest: "/admin/areas",
  },
  {
    name: "Cameras",
    img: <MaterialSymbolsAndroidCamera />,
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
export default sidebarItems;
