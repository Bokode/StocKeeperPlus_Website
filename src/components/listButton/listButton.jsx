import './listButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function ListButton({ list, index, setIndex }) {
  return (
    <>
    <div className='dropdown'>
      <button className="listButtonContainer">
        <p className='textListButton'>{list[index]}</p>
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
      <div className="dropdown-content">
        {
          list.map((item, i) => 
            <button className="dropdown-button" key={i} onClick={() => setIndex(i)}>{item}</button>
          )
        }
      </div>
    </div>
  </>
  )
}

export default ListButton;