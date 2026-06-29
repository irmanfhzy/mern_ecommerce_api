import { Link } from "react-router-dom";

export default function Dropdown({ lists, className = "" }) {
  return (
    <>
      {lists.map((list, index) => (
        <Link to={list.path} key={index} className={className}>
          {list.menu}
        </Link>
      ))}
    </>
  );
}
