import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";

function Topbar() {
  const listTable = ["Food", "UserFood", "IngredientAmount", "Store"];
  const listNumber = [5, 10, 20, 50];

  return (
    <div className="topBarContainer">
      <AddButton />
      <ListButton list={listTable}/>
      <SearchBar />
      <p className="textResult">Result </p>
      <ListButton list={listNumber}/>
    </div>
  )
}

export default Topbar;