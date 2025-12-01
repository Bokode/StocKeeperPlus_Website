import './contentTable.css'
import ConfirmationDeletePopUp from '../confirmationDeletePopUp/confirmationDeletePopUp';
import ExpiryCalendar from '../calendar/ExpiryCalendar';
import ReadPopUp from '../readPopUp/readPopUp';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';
import UpdatePopUp from '../updatePopUp/updatePopUp';

function ContentTable({ data, viewNumber, startItemIndex, deleteInstanceFromDB, updateInstanceFromDB }) {
  const lockedFields = ["mail", "id", "recipe", "food", "store", "user_mail"];
  const [identifierObject, setIdentifierObject] = useState(null);
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

  const columns = Object.keys(data[0]);

  const getIdentifierObject = (row) => {
    const obj = {};
    lockedFields.forEach((key) => {
      if (row[key] !== undefined) {
        obj[key] = row[key];
      }
    });
    return obj;
  };

  const findInstance = () => {
    return data.find(row =>
      Object.entries(identifierObject).every(
        ([key, val]) => row[key] === val
      )
    );
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
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className='buttonAction'
                  onClick={() => {
                    setIdentifierObject(getIdentifierObject(row));
                    setShowUpdatePopUp(true);
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
                    onClick={() => setShowCalendar(!showCalendar)}
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
        <ExpiryCalendar UserID={data[0].mail} />
      )}

      {showReadPopUp && (
        <ReadPopUp
          setShowReadPopUp={setShowReadPopUp}
          instanceAction={findInstance()}
          dataLabel={columns}
        />
      )}

      {showUpdatePopUp && (
        <UpdatePopUp
          setShowUpdatePopUp={setShowUpdatePopUp}
          instanceAction={findInstance()}
          dataLabel={columns}
          updateInstanceFromDB={updateInstanceFromDB}
          lockedFields={lockedFields}
        />
      )}
    </>
  );
}

export default ContentTable;
