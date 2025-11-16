import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";
import { useState } from "react";

function Topbar() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);

  return (
    <div className="containerTopBar">
      <AddButton />
      <ListButton list={listTable} index={indexTable} setIndex={setIndexTable}/>
      <SearchBar list={listTable} index={indexTable} setIndex={setIndexTable}/>
      <p className="textResultTopBar">Result </p>
      <ListButton list={listNumber} index={indexNumber} setIndex={setIndexNumber}/>
    </div>
  )
}

export default Topbar;