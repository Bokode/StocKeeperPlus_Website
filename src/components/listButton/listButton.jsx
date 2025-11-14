import './listButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function ListButton({ list }) {
  return (
    <button className="listButtonContainer">
      <p className='textListButton'>{list[0]}</p>
      <FontAwesomeIcon icon={faAngleDown} />
    </button>
  )
}

export default ListButton;