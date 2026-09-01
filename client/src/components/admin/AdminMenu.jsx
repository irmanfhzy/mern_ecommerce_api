import { Link } from "react-router-dom";

export default function AdminMenu({
  menuItems,
  open,
  onClick,
  className = "",
}) {
  return (
    <nav>
      {menuItems.map((menuItem) => {
        const Icon = menuItem.icon;

        return (
          <Link
            key={menuItem.path}
            to={menuItem.path}
            className={`flex items-center rounded-md p-3 hover:bg-gray-100 ${className}`}
            onClick={onClick}
          >
            {Icon && <Icon className="h-5 w-5 shrink-0" />}

            {open && (
              <span className="ml-3 whitespace-nowrap">{menuItem.label}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
