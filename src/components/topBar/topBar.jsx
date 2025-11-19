import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";

function Topbar({ listTable, listNumber, indexTable, indexNumber, setIndexTable, setIndexNumber, getInstanceFromDB}) {

  return (
    <div className="containerTopBar">
      <div className="separation firstThird">
        <AddButton />
        <ListButton list={listTable} index={indexTable} setIndex={setIndexTable}/>
      </div>
      <div className="separation secondThird">
        <SearchBar list={listTable} index={indexTable} setIndex={setIndexTable} getInstanceFromDB={getInstanceFromDB}/>
      </div>
      <div className="separation thirdThird">
        <p className="textResultTopBar">Result </p>
        <ListButton list={listNumber} index={indexNumber} setIndex={setIndexNumber}/>
      </div>
    </div>
  )
}

export default Topbar;