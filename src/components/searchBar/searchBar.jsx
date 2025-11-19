import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar({ list, index, getInstanceFromDB}) {
  const placeholder = "Search an instance of " + list[index];

  return (
    <div className="containerSearchBar">
      <FontAwesomeIcon icon={faBars} />
      <input className="inputSearchBar" placeholder={placeholder} id="idInput"/>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" onClick={() => getInstanceFromDB(document.getElementById('idInput').value)}/>
    </div>
  );
}

export default SearchBar;
