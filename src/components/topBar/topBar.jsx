import "./topBar.css"
import AddButton from "../addButton/addButton";
import SearchBar from "../searchBar/searchBar";
import ListButton from "../listButton/listButton";

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Topbar({ listTable, listNumber, indexTable, indexNumber, setIndexTable, setIndexNumber, localSearch, getAllInstanceFromDB, setShowCreatePopUp}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login', { replace: true });
  };

  return (
    <div className="containerTopBar">
      <div className="separation firstThird">
        <AddButton setShowCreatePopUp={setShowCreatePopUp}/>
        <ListButton list={listTable} index={indexTable} setIndex={setIndexTable}/>
      </div>
      <div className="separation secondThird">
        <SearchBar list={listTable} index={indexTable} setIndex={setIndexTable} localSearch={localSearch} getAllInstanceFromDB={getAllInstanceFromDB}/>
      </div>
      <div className="separation thirdThird">
        <p className="textResultTopBar">Result </p>
        <ListButton list={listNumber} index={indexNumber} setIndex={setIndexNumber}/>
        
        <button 
            onClick={handleLogout} 
            className="logout-btn" 
            title="Se déconnecter"
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  )
}

export default Topbar;