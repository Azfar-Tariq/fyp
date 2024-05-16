function SidebarItem({ item,active, onClick, ...rest }) {
    return (
      <li onClick={onClick} {...rest}
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

  export default SidebarItem