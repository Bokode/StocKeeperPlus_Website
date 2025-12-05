import './confirmationDeletePopUp.css'

function ConfirmationDeletePopUp({ setShowConfirmationDeletePopUp, idInstanceAction, deleteInstanceFromDB }) {
  return (
    <div className='backgroundPopUp' onClick={() => setShowConfirmationDeletePopUp(false)}>
      <div className='containerConfirmationPopUp' onClick={(e) => e.stopPropagation()}>
          <p>It will be permanently deleted, continue ?</p>
          <div className='containerDeleteButtonPopUp'>
              <button className='buttonPopUp' onClick={() => setShowConfirmationDeletePopUp(false)}>Cancel</button>
              <button className='buttonPopUp'onClick={() => {setShowConfirmationDeletePopUp(false); deleteInstanceFromDB(idInstanceAction);}}>Delete</button>
          </div>
      </div>
    </div>
  )
}

export default ConfirmationDeletePopUp;