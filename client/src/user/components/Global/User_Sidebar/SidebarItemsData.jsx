import { IconParkOutlineSettingConfig } from "../../../assets/icons/config";
import { MaterialSymbolsAccountCircle } from "../../../assets/icons/profile";

const sidebarItems = [
  {
    name: "Profile",
    img: <MaterialSymbolsAccountCircle />,
    dest: "/user",
  },
  {
    name: "Manual Control",
    img: <IconParkOutlineSettingConfig />,
    dest: "/user/manual-Control",
  },
];
export default sidebarItems;
