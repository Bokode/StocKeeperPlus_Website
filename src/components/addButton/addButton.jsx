import './addButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function AddButton() {
  return (
    <button className="addButtonContainer">
      <FontAwesomeIcon icon={faPlus} />
      <p className='textAddButton'>Add new</p>
    </button>
  )
}

export default AddButton;