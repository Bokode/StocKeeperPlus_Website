import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";

function Topbar({ listTable, listNumber, indexTable, indexNumber, setIndexTable, setIndexNumber, handleClick}) {

  return (
    <div className="containerTopBar">
      <AddButton />
      <ListButton list={listTable} index={indexTable} setIndex={setIndexTable}/>
      <SearchBar list={listTable} index={indexTable} setIndex={setIndexTable} handleClick={handleClick}/>
      <p className="textResultTopBar">Result </p>
      <ListButton list={listNumber} index={indexNumber} setIndex={setIndexNumber}/>
    </div>
  )
}

export default Topbar;