import './errorPopUp.css';

function ErrorPopUp({ error, setShowCreatePopUp }) {
  return (
    <div className="backgroundPopUp" onClick={() => setShowCreatePopUp(false)}>
      <div className="containerErrorPopUp" onClick={() => setShowCreatePopUp(false)}>
        <h2 className="titlePopUp">Erreur</h2>
        <p className="messagePopUp">{error.message}</p>

        {error.details.length > 0 && (
          <ul className="detailsPopUp">
            {error.details.map((d, i) => (
              <li key={i}>{d.message}</li>
            ))}
          </ul>
        )}
        <small className='smallText'>Cliquez n'importe où pour fermer</small>
      </div>
    </div>
  );
}
export default ErrorPopUp;