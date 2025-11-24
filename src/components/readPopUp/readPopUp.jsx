import './readPopUp.css'

function ReadPopUp({ setShowReadPopUp, instanceAction, dataLabel }) {
  return (
    <div className='backgroundPopUp' onClick={() => setShowReadPopUp(false)}>
      <div className='containerContentPopUp' onClick={(e) => e.stopPropagation()}>
          {dataLabel.map((key) => (
            <p className='textReadInstance' key={key}>{key.charAt(0).toUpperCase() + key.slice(1)} : {instanceAction[key]}</p>
          ))}
          <div className='containerReadButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowReadPopUp(false)}>Quit</button>
          </div>
      </div>
    </div>
  )
}

export default ReadPopUp;