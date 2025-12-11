import './App.css'
import ContentTable from '../components/contentTable/contentTable';
import PageChanger from '../components/pageChanger/pageChanger';
import Topbar from '../components/topBar/topBar';
import CreatePopUp from '../components/createPopUp/createPopUp';
import { useState, useEffect } from 'react';
import { authFetch } from '../utils/request';

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

  function createInstanceFromDB(dataInstance) {
    authFetch(`${BASE_URL}/${listTable[indexTable]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataInstance)
    })
      .then(response => response.json())
      .then(json => {
        if (json && (json?.message || json[0]?.message)) {
          alert(json?.message)
        } else {
          getAllInstanceFromDB();
        }
      })
      .catch(error => console.log(error));
  }

  function getAllInstanceFromDB() {
    authFetch(`${BASE_URL}/${listTable[indexTable]}/all`)
      .then(response => response.json())
      .then(json => {setData(json); setFilteredData(null);})
      .catch(error => {setData(null); console.log(error)});
  }

  /*function getInstanceFromDB(searchQuery) {
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
  }*/

  function updateInstanceFromDB(dataInstance) {
    authFetch(`${BASE_URL}/${listTable[indexTable]}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataInstance)
    })
      .then(response => {
        if (!response.ok) {
          alert("Problème")
        } else {
          getAllInstanceFromDB();
        }
      })
      .catch(error => console.log(error));
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
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} localSearch={localSearch} getAllInstanceFromDB={getAllInstanceFromDB} setShowCreatePopUp={setShowCreatePopUp}/>
      <ContentTable data={filteredData || data} viewNumber={listNumber[indexNumber]} startItemIndex={startItemIndex} deleteInstanceFromDB={deleteInstanceFromDB} updateInstanceFromDB={updateInstanceFromDB} columns={columns} metadata={metadata} currentTable={listTable[indexTable]}/>
      <PageChanger numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} onPageChange={onPageChange}/>
      {showCreatePopUp && (<CreatePopUp setShowCreatePopUp={setShowCreatePopUp} columns={metadata[indexTable].columns} table={metadata[indexTable].name} createInstanceFromDB={createInstanceFromDB}/>)} 
    </div>
  )
}

export default Dashboard;