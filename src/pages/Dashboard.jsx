import './App.css'
import ContentTable from '../components/contentTable/contentTable';
import PageChanger from '../components/pageChanger/pageChanger';
import Topbar from '../components/topBar/topBar';
import CreatePopUp from '../components/createPopUp/createPopUp';
import ErrorPopUp from '../components/errorPopUp/ErrorPopUp';
import { useState, useEffect } from 'react';
import { authFetch, errorMessageHandling } from '../utils/request';
import Maps from '../components/maps/maps.jsx';

function Dashboard() {
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [startItemIndex, setStartItemIndex] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [showCreatePopUp, setShowCreatePopUp] = useState(false);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const BASE_URL = "http://localhost:3001/v1";

  useEffect(() => {
    authFetch(`${BASE_URL}/metadata`)
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
        
        setErrorMessage(errorMessageHandling("Erreur interne: Veuillez recharger la page."));
        setShowErrorPopUp(true);
        return;
    }

    try {
        
        const response = await authFetch(`${BASE_URL}/${tableName}`, {
            method: 'POST',
            body: JSON.stringify(dataInstance)
            
        });
        
        const json = await response.json();

        
        if (json && (json.message || json[0]?.message)) {
            
            setErrorMessage(errorMessageHandling((json.message || json[0]?.message)));
            setShowErrorPopUp(true);
        } else {
            getAllInstanceFromDB();
            return true;
        }
        
    } catch (error) {
        
        const errorObj = JSON.parse(error.message);
        setErrorMessage(errorMessageHandling(errorObj));
        setShowErrorPopUp(true);
    }
}

  function localSearch(searchValue) {
    const allowedColumns = ["label", "mail", "recipe", "food", "user", "store"]
    if (!data) return;
    const query = searchValue.toLowerCase();
    const filtered = data.filter(row =>
    allowedColumns.some(col =>
      row[col] !== undefined &&
      String(row[col]).toLowerCase().includes(query)
    )
  );
    setFilteredData(filtered);
  }

  function getAllInstanceFromDB() {
    authFetch(`${BASE_URL}/${listTable[indexTable]}/all`)
      .then(response => response.json())
      .then(json => {setData(json); setFilteredData(null);})
      .catch(error => setData(null));
  }

async function updateInstanceFromDB(dataInstance) { 
    const tableName = listTable[indexTable];
    
    if (!tableName) {
        setErrorMessage(errorMessageHandling("Erreur table non definie"));
        setShowErrorPopUp(true);
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
            messagePourPopup = errorObj;
        } catch (e) {
            
            if (error.message.includes("Session expirée")) {
                 return; 
            }
            messagePourPopup = error.message;
        }
        
        setErrorMessage(errorMessageHandling(messagePourPopup));
        setShowErrorPopUp(true);
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
      .catch(error => { setErrorMessage(errorMessageHandling(error)); setShowErrorPopUp(true); });
  }

  if (!metadata) return <div>Chargement...</div>;

  return (
    <div className='containerApp'>
      <Topbar 
        listTable={listTable} 
        listNumber={listNumber} 
        indexTable={indexTable} 
        indexNumber={indexNumber} 
        setIndexTable={setIndexTable} 
        setIndexNumber={setIndexNumber} 
        localSearch={localSearch} 
        getAllInstanceFromDB={getAllInstanceFromDB} 
        setShowCreatePopUp={setShowCreatePopUp}
      />
      <ContentTable 
        data={filteredData || data} 
        viewNumber={listNumber[indexNumber]} 
        startItemIndex={startItemIndex} 
        deleteInstanceFromDB={deleteInstanceFromDB} 
        updateInstanceFromDB={updateInstanceFromDB} 
        columns={columns} 
        metadata={metadata} 
        currentTable={listTable[indexTable]}
      />
      {listTable[indexTable] === "Store" && <Maps />}
      <PageChanger 
        numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} 
        onPageChange={onPageChange}
      />
      {showCreatePopUp && 
        (<CreatePopUp 
          setShowCreatePopUp={setShowCreatePopUp} 
          columns={metadata[indexTable].columns} 
          table={metadata[indexTable].name} 
          createInstanceFromDB={createInstanceFromDB} 
          setErrorMessage={setErrorMessage} 
          setShowErrorPopUp={setShowErrorPopUp}
        />)} 
      {showErrorPopUp && 
        (<ErrorPopUp 
          error={errorMessage} 
          setShowCreatePopUp={setShowErrorPopUp}
        />)}
    </div>
  )
}

export default Dashboard;