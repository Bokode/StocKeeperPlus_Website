import './contentTable.css'
import ConfirmationDeletePopUp from '../confirmationDeletePopUp/confirmationDeletePopUp';
import ExpiryCalendar from '../calendar/ExpiryCalendar';
import ReadPopUp from '../readPopUp/readPopUp';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';
import UpdatePopUp from '../updatePopUp/updatePopUp';

function ContentTable({ data, viewNumber, startItemIndex, deleteInstanceFromDB, updateInstanceFromDB }) {
  const [idInstanceAction, setIdInstanceAction] = useState(null);
  const [showConfirmationDeletePopUp, setShowConfirmationDeletePopUp] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReadPopUp, setShowReadPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp]= useState(false);

  if (!data || data.length === 0) {
    return <>
      <p className='waitMessage'>Oups — on n'a rien trouvé ici. 😢</p>
      <p className='waitMessage'>Essayez une autre recherche</p>
    </>;
  }

  const columns = Object.keys(data[0]);
  const idKey = columns[0];

  return (
    <>
      <table className='containerTable'>
        <tbody className='bodyTable'>

          <tr className='columnTable'>
            {columns.map(col => (
              <th key={col} className='headerColumn'>{col}</th>
            ))}
            <th className='headerColumn actionColumn'>action</th>
          </tr>

          {data.slice(startItemIndex, startItemIndex + viewNumber).map((row, i) => (
            <tr key={i} className='columnTable'>
              {columns.map(col => {
                let value = row[col];
                if (typeof value === "boolean") value = value ? "Oui" : "Non";
                return <td key={col} className='contentColumn'>{value}</td>;
              })}

              <td className='contentColumn actionColumn'>
                <button className='buttonAction' onClick={() => { setIdInstanceAction(row[idKey]); setShowReadPopUp(true); }}><FontAwesomeIcon icon={faEye} /></button>
                <button className='buttonAction' onClick={() => { setIdInstanceAction(row[idKey]); setShowUpdatePopUp(true); }}><FontAwesomeIcon icon={faPencil} /></button>
                <button className='buttonAction' onClick={() => { setIdInstanceAction(row[idKey]); setShowConfirmationDeletePopUp(true); }}><FontAwesomeIcon icon={faTrash} /></button>
                {idKey === "mail" && (
                  <button className='buttonAction' onClick={() => setShowCalendar(!showCalendar)}><FontAwesomeIcon icon={faCalendar} /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmationDeletePopUp && (<ConfirmationDeletePopUp setShowConfirmationDeletePopUp={setShowConfirmationDeletePopUp} idInstanceAction={idInstanceAction} deleteInstanceFromDB={deleteInstanceFromDB} />)}
      {showCalendar && (<ExpiryCalendar UserID={data[0].mail} />)}
      {showReadPopUp && (<ReadPopUp setShowReadPopUp={setShowReadPopUp} instanceAction={data.find(row => row[idKey] === idInstanceAction)} dataLabel={columns}/>)}
      {showUpdatePopUp && (<UpdatePopUp setShowUpdatePopUp={setShowUpdatePopUp} instanceAction={data.find(row => row[idKey] === idInstanceAction)} dataLabel={columns} updateInstanceFromDB={updateInstanceFromDB}/>)} 
    </>
  );
}

export default ContentTable;