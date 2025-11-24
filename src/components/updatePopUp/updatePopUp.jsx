import './updatePopUp.css'

function UpdatePopUp({ setShowUpdatePopUp, instanceAction, dataLabel }) {
  return (
    <div className='backgroundPopUp' onClick={() => setShowUpdatePopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
          {dataLabel.map((key, index) => {
            const isFirstColumn = index === 0;

            return (
            <div key={key} className='containerReadInstance'>
              <p className='textReadInstance'>{key.charAt(0).toUpperCase() + key.slice(1)} : </p>
              <input className={`inputReadInstance ${isFirstColumn ? "inputDisabled" : ""}`} placeholder={instanceAction[key]}></input>
            </div>
          )})}
          <div className='containerButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowUpdatePopUp(false)}>Cancel</button>
              <button className='buttonPopUp' onClick={() => setShowUpdatePopUp(false)}>Update</button>
          </div>
      </div>
    </div>
  )
}

export default UpdatePopUp;