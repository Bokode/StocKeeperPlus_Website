import './confirmationPopUp.css'

function ConfirmationPopUp({ text }) {
  return (
    <div className='containerConfirmationPopUp'>
        <p>{text}</p>
        <div>
            <button>Non</button>
            <button>Oui</button>
        </div>
    </div>
  )
}

export default ConfirmationPopUp;