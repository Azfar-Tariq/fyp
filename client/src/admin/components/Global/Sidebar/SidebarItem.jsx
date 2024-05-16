function SidebarItem({ item, active, onClick, ...rest }) {
  return (
    <li
      onClick={onClick}
      {...rest}
      className={`relative flex items-center py-2 px-3 gap-4 my-1 font-medium rounded-md cursor-pointer transition-all duration-100 group ${
        active
          ? "bg-icon text-background text-lg"
          : "hover:bg-icon hover:text-background text-white hover:text-lg"
      }`}
    >
      {item.img}
      <span
        className={`overflow-hidden text-md font-medium transition-all duration-100`}
      >
        {item.name}
      </span>
    </li>
  );
}

export default SidebarItem;
