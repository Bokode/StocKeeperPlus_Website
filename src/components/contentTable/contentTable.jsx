import './contentTable.css'
import ConfirmationDeletePopUp from '../confirmationDeletePopUp/confirmationDeletePopUp';
import ExpiryCalendar from '../calendar/ExpiryCalendar';
import ReadPopUp from '../readPopUp/readPopUp';
import UpdatePopUp from '../updatePopUp/updatePopUp';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { formatRow } from '../../utils/tableFormatters';

function ContentTable({ data, viewNumber, startItemIndex, deleteInstanceFromDB, updateInstanceFromDB, columns, metadata, currentTable }) {
  const lockedFields = [];
  metadata.forEach(table => {lockedFields.push(...table.primaryKeys);});
  const [identifierObject, setIdentifierObject] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [calendarUserID, setCalendarUserID] = useState(null);
  const [formattedData, setFormattedData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Garder les données originales

  const [showConfirmationDeletePopUp, setShowConfirmationDeletePopUp] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReadPopUp, setShowReadPopUp] = useState(false);
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  
  const mapper = [{from:"nbeaters", to:"number of eaters"}];

  // Formater les données à chaque changement
  useEffect(() => {
    const formatData = async () => {
      if (!data || data.length === 0) {
        setFormattedData([]);
        setOriginalData([]);
        return;
      }

      setOriginalData(data); // Sauvegarder les données originales
      const formatted = await Promise.all(
        data.map(row => formatRow(currentTable, row, columns))
      );
      setFormattedData(formatted);
    };

    formatData();
  }, [data, currentTable, columns]);

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

  // Fonction pour charger les détails complets d'une recette
  const handleEditRecipe = async (row) => {
    if (currentTable === "Recipe") {
      try {
        const response = await fetch(`http://localhost:3001/Recipe/get/${row.id}`);
        const fullRecipe = await response.json();
        setSelectedRow(fullRecipe);
        setShowUpdatePopUp(true);
      } catch (error) {
        console.error("Erreur lors du chargement de la recette:", error);
        alert("Impossible de charger les détails de la recette");
      }
    } else {
      setSelectedRow(row);
      setShowUpdatePopUp(true);
    }
  };

  // Fonction pour voir les détails (avec ingrédients pour les recettes)
  const handleViewDetails = async (row) => {
    if (currentTable === "Recipe") {
      try {
        const response = await fetch(`http://localhost:3001/Recipe/get/${row.id}`);
        const fullRecipe = await response.json();
        setSelectedRow(fullRecipe);
        setShowReadPopUp(true);
      } catch (error) {
        console.error("Erreur lors du chargement de la recette:", error);
        alert("Impossible de charger les détails de la recette");
      }
    } else {
      setSelectedRow(row);
      setShowReadPopUp(true);
    }
  };

  function Translate(key){
    const tmp = mapper.find(elem => elem.from === key);
    return tmp?.to ?? key;
  }

  return (
    <>
      <table className='containerTable'>
        <tbody className='bodyTable'>
          <tr className='columnTable'>
            {columns.map(col => (
              <th key={col} className='headerColumn'>{Translate(col)}</th>
            ))}
            <th className='headerColumn actionColumn'>action</th>
          </tr>
          {data.slice(startItemIndex, startItemIndex + viewNumber).map((row, i) => (
            <tr key={i} className='columnTable'>
              {columns.map(col => {
                let value = row[col];
                if (typeof value === "boolean") value = value ? "Oui" : "Non";
                if (col === "imagepath") value = value.length > 20 ? value.slice(0, 20) + "..." : value;
                return <td key={col} className='contentColumn'>{value}</td>;
              })}

              <td className='contentColumn actionColumn'>
                <button
                  className='buttonAction'
                  onClick={() => handleViewDetails(row)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>

                <button
                  className='buttonAction'
                  onClick={() => handleEditRecipe(row)}
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
                      setIdentifierObject(getIdentifierObject(originalRow));
                      setShowConfirmationDeletePopUp(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  {columns.includes("mail") && (
                    <button
                      className='buttonAction'
                      onClick={() => {
                        setCalendarUserID(originalRow.mail);
                        setShowCalendar(!showCalendar);
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendar} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
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
          table={currentTable}
        />
      )}

      {showUpdatePopUp && (
        <UpdatePopUp
          setShowUpdatePopUp={setShowUpdatePopUp}
          instanceAction={selectedRow}
          dataLabel={columns}
          updateInstanceFromDB={updateInstanceFromDB}
          lockedFields={lockedFields}
          table={currentTable}
        />
      )}
    </>
  );
}

export default ContentTable;