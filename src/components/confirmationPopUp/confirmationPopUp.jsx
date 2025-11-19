import './confirmationPopUp.css'

function ConfirmationPopUp({ text, setShowConfirmationPopUp }) {
  return (
    <div className='backgroundPopUp'>
      <div className='containerConfirmationPopUp'>
          <p>{text}</p>
          <div className='containerButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowConfirmationPopUp(false)}>Non</button>
              <button className='buttonPopUp'onClick={() => setShowConfirmationPopUp(false)}>Oui</button>
          </div>
      </div>
    </div>
  )
}

export default ConfirmationPopUp;