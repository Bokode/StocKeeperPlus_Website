import './addButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function AddButton({ setShowCreatePopUp }) {
  return (
    <button className="containerAddButton" onClick={() => setShowCreatePopUp(true)}>
      <FontAwesomeIcon icon={faPlus} />
      <p className='textAddButton'>Add new</p>
    </button>
  )
}

export default AddButton;