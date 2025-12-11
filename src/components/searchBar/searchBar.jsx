import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function SearchBar({ list, index, localSearch, getAllInstanceFromDB }) {
  const [searchValue, setSearchValue] = useState("");
  const placeholder = "Search an instance of " + list[index];

  function handleSearch() {
    if (searchValue.trim() !== "") {
      localSearch(searchValue);
    } else {
      getAllInstanceFromDB();
    }
  }
  
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="containerSearchBar">
      <FontAwesomeIcon icon={faBars} onClick={() => getAllInstanceFromDB()}/>
      <input className="inputSearchBar" placeholder={placeholder} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleEnterKey}/>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" onClick={() => {handleSearch()}}/>
    </div>
  );
}

export default SearchBar;