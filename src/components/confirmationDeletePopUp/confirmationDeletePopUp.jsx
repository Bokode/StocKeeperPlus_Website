import './confirmationDeletePopUp.css'

function ConfirmationDeletePopUp({ setShowConfirmationDeletePopUp, idInstanceAction, deleteInstanceFromDB }) {
  return (
    <div className='backgroundPopUp'>
      <div className='containerConfirmationPopUp'>
          <p>Etes vous sur de vouloir supprimer cette instance ?</p>
          <div className='containerButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowConfirmationDeletePopUp(false)}>Non</button>
              <button className='buttonPopUp'onClick={() => {setShowConfirmationDeletePopUp(false); deleteInstanceFromDB(idInstanceAction);}}>Oui</button>
          </div>
      </div>
    </div>
  )
}

export default ConfirmationDeletePopUp;