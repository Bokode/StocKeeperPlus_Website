import './contentTable.css'
import ConfirmationDeletePopUp from '../confirmationDeletePopUp/confirmationDeletePopUp';
import ExpiryCalendar from '../calendar/ExpiryCalendar';
import ReadPopUp from '../readPopUp/readPopUp';
import UpdatePopUp from '../updatePopUp/updatePopUp';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';

function ContentTable({ data, viewNumber, startItemIndex, deleteInstanceFromDB, updateInstanceFromDB, columns, metadata }) {
  const lockedFields = [];
  metadata.forEach(table => {lockedFields.push(...table.primaryKeys);});
  const [identifierObject, setIdentifierObject] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [calendarUserID, setCalendarUserID] = useState(null);

  const [showConfirmationDeletePopUp, setShowConfirmationDeletePopUp] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReadPopUp, setShowReadPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);

  if (!data || data.length === 0) {
    return (
      <>
        <p className='waitMessage'>Oups — on n'a rien trouvé ici. 😢</p>
        <p className='waitMessage'>Essayez une autre recherche</p>
      </>
    );
  }

  const getIdentifierObject = (row) => {
    const obj = {};
    lockedFields.forEach((key) => {
      if (row[key] !== undefined) {
        obj[key] = row[key];
      }
    });
    return obj;
  };

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
                <button
                  className='buttonAction'
                  onClick={() => {
                    setIdentifierObject(getIdentifierObject(row));
                    setShowReadPopUp(true);
                    setSelectedRow(row);;
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className='buttonAction'
                  onClick={() => {
                    setIdentifierObject(getIdentifierObject(row));
                    setShowUpdatePopUp(true);
                    setSelectedRow(row);
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} />
                </button>

                <button
                  className='buttonAction'
                  onClick={() => {
                    setIdentifierObject(getIdentifierObject(row));
                    setShowConfirmationDeletePopUp(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                {columns.includes("mail") && (
                  <button
                    className='buttonAction'
                    onClick={() => {
                      setCalendarUserID(row.mail);
                      setShowCalendar(!showCalendar);
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                  </button>
                )}
              </td>
            </tr>
          ))}

        </tbody>
      </table>

      {showConfirmationDeletePopUp && (
        <ConfirmationDeletePopUp
          setShowConfirmationDeletePopUp={setShowConfirmationDeletePopUp}
          idInstanceAction={identifierObject}
          deleteInstanceFromDB={deleteInstanceFromDB}
        />
      )}

      {showCalendar && (
        <ExpiryCalendar UserID={calendarUserID} />
      )}

      {showReadPopUp && (
        <ReadPopUp
          setShowReadPopUp={setShowReadPopUp}
          instanceAction={selectedRow}
          dataLabel={columns}
        />
      )}

      {showUpdatePopUp && (
        <UpdatePopUp
          setShowUpdatePopUp={setShowUpdatePopUp}
          instanceAction={selectedRow}
          dataLabel={columns}
          updateInstanceFromDB={updateInstanceFromDB}
          lockedFields={lockedFields}
        />
      )}
    </>
  );
}

export default ContentTable;
