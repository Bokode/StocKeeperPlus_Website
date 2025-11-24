import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function SearchBar({ list, index, getInstanceFromDB }) {
  const [searchValue, setSearchValue] = useState("");
  const placeholder = "Search an instance of " + list[index];

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      getInstanceFromDB(searchValue);
    }
  };

  return (
    <div className="containerSearchBar">
      <FontAwesomeIcon icon={faBars} />
      <input className="inputSearchBar" placeholder={placeholder} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleEnterKey}/>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" onClick={() => {if (searchValue.trim() !== "") {getInstanceFromDB(searchValue);}}}/>
    </div>
  );
}

export default SearchBar;