import { IoSearch } from "react-icons/io5";

export default function SearchBar() {
  return (
    <form className="flex bg-white text-black h-full rounded-2xl">
      <input
        type="text"
        placeholder="Search Products"
        className="flex-1 px-4"
      />
      <button className="px-3">
        <IoSearch className="w-6 h-6 hover:cursor-pointer" />
      </button>
    </form>
  );
}
