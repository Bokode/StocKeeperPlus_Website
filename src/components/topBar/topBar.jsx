import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";

function Topbar() {
  return (
    <div className="topBarContainer">
      <AddButton />
      <ListButton />
      <SearchBar />
    </div>
  )
}

export default Topbar;