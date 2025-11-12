import './listButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function ListButton() {
  return (
    <div className="listButtonContainer">
      <p className='textListButton'>Food</p>
      <FontAwesomeIcon icon={faAngleDown} />
    </div>
  )
}

export default ListButton;