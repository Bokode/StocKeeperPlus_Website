import './confirmationPopUp.css'

function ConfirmationPopUp({ text }) {
  return (
    <div className='backgroundPopUp'>
      <div className='containerConfirmationPopUp'>
          <p>{text}</p>
          <div className='containerButtonPopUp'>
              <button>Non</button>
              <button>Oui</button>
          </div>
      </div>
    </div>
  )
}

export default ConfirmationPopUp;