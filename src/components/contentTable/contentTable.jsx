import './contentTable.css'
import ConfirmationDeletePopUp from '../confirmationDeletePopUp/confirmationDeletePopUp';
import ExpiryCalendar from '../calendar/ExpiryCalendar';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';

function ContentTable({ data, viewNumber, startItemIndex, deleteInstanceFromDB }) {
  const [idInstanceAction, setIdInstanceAction] = useState(0);
  const [showConfirmationDeletePopUp, setShowConfirmationDeletePopUp] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  if (!data || data.length === 0) {
    return (
      <>
        <p className='waitMessage'>Oups — on n'a rien trouvé ici. 😢</p>
        <p className='waitMessage'>Essayez une autre recherche</p>
      </>
    )
  }

  return (
    <>
    <table className='containerTable'>
      <tbody className='bodyTable'>
        <tr className='columnTable'>
          {Object.keys(data[0]).map((key) => (
            <th className='headerColumn' key={key}>{key}</th>
          ))}
          <th className='headerColumn actionColumn'>action</th>
        </tr>

        {data.slice(startItemIndex, startItemIndex+viewNumber).map((row, i) => (
          <tr className='columnTable' key={i}>
            {Object.keys(row).map((key) => {
              let value = row[key];
              
              if (typeof value === "boolean") {
                value = value ? "Oui" : "Non";
              } else if (key === "expirationdate") {
                value = value.slice(0, 10);
              }
            
              return (
                <td className='contentColumn' key={key}>{value}</td>
              );
            })}
            <td className='contentColumn actionColumn'>
              <button className='buttonAction'><FontAwesomeIcon icon={faEye} /></button>
              <button className='buttonAction'><FontAwesomeIcon icon={faPencil} /></button>
              <button className='buttonAction' onClick={() => {setShowConfirmationDeletePopUp(true); setIdInstanceAction(Object.values(row)[0]);}}><FontAwesomeIcon icon={faTrash} /></button>
              {(Object.keys(row)[0] == "mail") ? <button className='buttonAction' onClick={() => setShowCalendar(!showCalendar)}><FontAwesomeIcon icon={faCalendar} /></button> : <></>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {showConfirmationDeletePopUp && (<ConfirmationDeletePopUp setShowConfirmationDeletePopUp={setShowConfirmationDeletePopUp} idInstanceAction={idInstanceAction} deleteInstanceFromDB={deleteInstanceFromDB}/>)}
    {showCalendar && (<ExpiryCalendar UserID={Object.values(data)[0]["mail"]}/>)}
    </>
  );
}

export default ContentTable;