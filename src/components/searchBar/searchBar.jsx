import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar({ list, index}) {
  const placeholder = "Search an instance of " + list[index];

  return (
    <div className="searchBarContainer">
      <FontAwesomeIcon icon={faBars} />
      <input className="inputSearch" placeholder={placeholder} id="id"/>
      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => console.log("search launched")}/>
    </div>
  );
}

export default SearchBar;
