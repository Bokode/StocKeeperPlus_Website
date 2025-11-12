import "./searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  return (
    <div className="searchBarContainer">
      <FontAwesomeIcon icon={faBars} />
      <input className="inputSearch" placeholder="Search an instance of recipe" id="id"/>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </div>
  );
}

export default SearchBar;
