import MenuItems from "./MenuItems";

export default function NavMenu({ menuItems, className = "" }) {
  return (
    <nav className={className}>
      <MenuItems menuItems={menuItems} />
    </nav>
  );
}
