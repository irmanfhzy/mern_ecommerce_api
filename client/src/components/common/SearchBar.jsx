import { useContext, useState } from "react";
import { SearchContext } from "../../contexts/SearchContext";
import { IoSearch } from "react-icons/io5";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const { setKeyword } = useContext(SearchContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeyword(input.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white text-black w-full h-full rounded-2xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Products"
        className="flex-1 px-4"
      />
      <button type="submit" className="px-3">
        <IoSearch className="w-6 h-6 hover:cursor-pointer" />
      </button>
    </form>
  );
}
