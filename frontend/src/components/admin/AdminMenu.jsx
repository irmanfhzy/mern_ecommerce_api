import { Link } from "react-router-dom";

export default function AdminMenu() {
  return (
    <ul className="flex flex-col">
      <li>
        <Link to="/admin">Dashboard</Link>
      </li>
      <li>
        <Link to="/admin/products">Products</Link>
      </li>
    </ul>
  );
}
