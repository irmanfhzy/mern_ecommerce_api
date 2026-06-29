import { useState } from "react";
import { SearchContext } from "../contexts/SearchContext";

export default function SearchProvider({ children }) {
  const [keyword, setKeyword] = useState("");

  return (
    <SearchContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </SearchContext.Provider>
  );
}
