import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  defaultValue = "",
  className = "",
}) {
  const [input, setInput] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(input.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex h-10 w-full min-w-0 items-center overflow-hidden rounded-lg border bg-white text-black ${className}`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-4 outline-none"
      />

      <button
        type="submit"
        className="flex h-full shrink-0 items-center justify-center px-3"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
