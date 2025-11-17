import './listButton.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function ListButton({ list, index, setIndex }) {
  return (
    <div className='containerDropdown'>
      <button className="buttonDropdown">
        <p className='textButton'>{list[index]}</p>
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
      <div className="containernContentDropdown">
        {
          list.map((item, i) => 
            <button className="buttonContentDropdown" key={i} onClick={() => setIndex(i)}>{item}</button>
          )
        }
      </div>
    </div>
  )
}

export default ListButton;