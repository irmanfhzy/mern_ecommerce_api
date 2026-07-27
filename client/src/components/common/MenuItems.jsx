import { Link } from "react-router-dom";

export default function MenuItems({
  menuItems,
  openMenu,
  setOpenMenu,
  className = "",
  onClick,
}) {
  return menuItems.map((menuItem) => {
    const Icon = menuItem.icon;
    const hasChildren = menuItem.children?.length > 0;

    return (
      <div key={menuItem.path ?? menuItem.label}>
        {hasChildren ? (
          <>
            <button
              type="button"
              className={`flex items-center gap-2 ${className}`}
              onClick={() =>
                setOpenMenu?.(
                  openMenu === menuItem.label ? null : menuItem.label,
                )
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{menuItem.label}</span>
            </button>

            {openMenu === menuItem.label && (
              <div className="ml-4">
                {menuItem.children.map((child) => {
                  const ChildIcon = child.icon;

                  return (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`flex items-center gap-2 ${className}`}
                      onClick={onClick}
                    >
                      {ChildIcon && <ChildIcon className="w-5 h-5" />}
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <Link
            to={menuItem.path}
            className={`flex items-center gap-2 ${className}`}
            onClick={onClick}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{menuItem.label}</span>
          </Link>
        )}
      </div>
    );
  });
}
