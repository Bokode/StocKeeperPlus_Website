import './App.css'
import ContentTable from '../components/contentTable/contentTable';
import PageChanger from '../components/pageChanger/pageChanger';
import Topbar from '../components/topBar/topBar';
import CreatePopUp from '../components/createPopUp/createPopUp';
import { useState, useEffect } from 'react';
import { authFetch, errorMessageHandling } from '../utils/request';

function Dashboard() {
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [startItemIndex, setStartItemIndex] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [showCreatePopUp, setShowCreatePopUp] = useState(false);
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    fetch(`${BASE_URL}/metadata`)
      .then(res => res.json())
      .then(json => setMetadata(json));
  }, []);
  
  const listTable = metadata ? metadata.map(t => t.name) : [];

  useEffect(() => {
  getAllInstanceFromDB();
  if (metadata) {
    setColumns(metadata[indexTable].columns.filter(col => col !== "password"));
  }
}, [indexTable, metadata]);


  function onPageChange(i) {
    setStartItemIndex((i-1)*listNumber[indexNumber]);
  }

async function createInstanceFromDB(dataInstance) {

    const tableName = listTable[indexTable];
    if (!tableName) {
        console.error("Erreur: Le nom de la table n'est pas défini. Vérifiez l'état 'metadata'.");
        alert("Erreur interne: Veuillez recharger la page.");
        return;
    }

    try {
        
        const response = await authFetch(`${BASE_URL}/${tableName}`, {
            method: 'POST',
            body: JSON.stringify(dataInstance)
            
        });
        
        const json = await response.json();

        
        if (json && (json.message || json[0]?.message)) {
            alert(json.message || json[0]?.message);
        } else {
            getAllInstanceFromDB();
            return true;
        }
        
    } catch (error) {
        
        let messagePourPopup = "Erreur inconnue";
        const errorObj = JSON.parse(error.message);
        messagePourPopup = errorMessageHandling(errorObj);
        alert(messagePourPopup);
    }
}

  function getAllInstanceFromDB() {
    authFetch(`${BASE_URL}/${listTable[indexTable]}/all`)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {setData(null); console.log(error)});
  }

  function getInstanceFromDB(searchQuery) {
    const nbPrimaryKeys = metadata[indexTable].primaryKeys.length;
    const parts = searchQuery.split(";").map(p => p.trim());

    if (parts.length !== nbPrimaryKeys) {
      return alert(`Cette table nécessite ${nbPrimaryKeys} ID\nSi plusieurs ID, ils doivent être séparés par un point-virgule`);
    } else {
      authFetch(`${BASE_URL}/${listTable[indexTable]}/get/${(nbPrimaryKeys === 1 ? parts[0] : parts[0] + "/" + parts[1])}`)
        .then(response => response.json())
        .then(json => {
          if (json && (json?.message || json[0]?.message)) {
            console.error("Erreur :", json?.message);
            setData([]);
          } else {
            setData([json]);
          }
        })
        .catch(error => { setData(null); console.log(error) });
    }
  }

async function updateInstanceFromDB(dataInstance) { 
    const tableName = listTable[indexTable];
    
    if (!tableName) {
        alert("Erreur: Table non définie.");
        return;
    }

    try {

        const response = await authFetch(`${BASE_URL}/${tableName}`, {
            method: 'PATCH',
            body: JSON.stringify(dataInstance)
        });

        getAllInstanceFromDB();
        return true;
        

    } catch (error) {
        
        let messagePourPopup = "Erreur de connexion au serveur.";

        try {
            
            const errorObj = JSON.parse(error.message);
            
            
            messagePourPopup = errorMessageHandling(errorObj);
            
        } catch (e) {
            
            if (error.message.includes("Session expirée")) {
                 return; 
            }
            messagePourPopup = error.message;
        }
        
        alert(messagePourPopup);
    }
}


  function deleteInstanceFromDB(idObj) {
    authFetch(`${BASE_URL}/${listTable[indexTable]}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idObj)
    })
      .then(response => {
        if (!response.ok) throw new Error('Delete failed');
      })
      .then(() => getAllInstanceFromDB())
      .catch(error => { console.log(error); });
  }

  if (!metadata) return <div>Chargement...</div>;

  return (
    <div className='containerApp'>
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} getInstanceFromDB={getInstanceFromDB} getAllInstanceFromDB={getAllInstanceFromDB} setShowCreatePopUp={setShowCreatePopUp}/>
      <ContentTable data={data} viewNumber={listNumber[indexNumber]} startItemIndex={startItemIndex} deleteInstanceFromDB={deleteInstanceFromDB} updateInstanceFromDB={updateInstanceFromDB} columns={columns} metadata={metadata} currentTable={listTable[indexTable]}/>
      <PageChanger numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} onPageChange={onPageChange}/>
      {showCreatePopUp && (<CreatePopUp setShowCreatePopUp={setShowCreatePopUp} columns={metadata[indexTable].columns} table={metadata[indexTable].name} createInstanceFromDB={createInstanceFromDB}/>)} 
    </div>
  )
}

export default Dashboard;