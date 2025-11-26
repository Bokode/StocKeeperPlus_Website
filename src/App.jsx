import './App.css'
import ContentTable from './components/contentTable/contentTable';
import PageChanger from './components/pageChanger/pageChanger';
import Topbar from './components/topBar/topBar';
import CreatePopUp from './components/createPopUp/createPopUp';
import { useState, useEffect } from 'react';

function App() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [startItemIndex, setStartItemIndex] = useState(0);
  const [columnsAdd, setColumnsAdd] = useState(null);
  const [data, setData] = useState(null);
  const [showCreatePopUp, setShowCreatePopUp] = useState(false);

  useEffect(() => {
    getAllInstanceFromDB()
    getTableColumns().then(cols => setColumnsAdd(cols));
  }, [indexTable]);

  function onPageChange(i) {
    setStartItemIndex((i-1)*listNumber[indexNumber]);
  }

  function getTableColumns() {
    return fetch('http://localhost:3001/' + listTable[indexTable] + '/columns')
      .then(res => res.json());
  }

  function createInstanceFromDB(dataInstance) {
    fetch('http://localhost:3001/' + listTable[indexTable], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataInstance)
    })
      .then(response => response.json())
      .then(json => {
        if (json && json.message) {
          alert(json.message)
        } else {
          getAllInstanceFromDB();
        }
      })
      .catch(error => console.log(error));
  }

  function getAllInstanceFromDB() {
    fetch('http://localhost:3001/' + listTable[indexTable] + '/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {setData(null); console.log(error)});
  }

  function getInstanceFromDB(id) {
    fetch('http://localhost:3001/' + listTable[indexTable] + '/get/' + id)
      .then(response => response.json())
      .then(json => {
        if (json && json.message) {
          console.error("Erreur :", json.message);
          setData([]);
        } else {
          setData([json]);
        }
      })
      .catch(error => { setData(null); console.log(error) });
  }


  function updateInstanceFromDB(dataInstance) {
    fetch('http://localhost:3001/' + listTable[indexTable], {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataInstance)
    })
      .then(response => response.json())
      .then(json => {
        if (json && json.message) {
          alert(json.message)
        } else {
          getAllInstanceFromDB();
        }
      })
      .catch(error => console.log(error));
  }


  function deleteInstanceFromDB(id) {
    const firstColumnKey = Object.keys(data[0])[0];

    fetch('http://localhost:3001/' + listTable[indexTable], {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [firstColumnKey]: id })
    })
      .then(response => {if (!response.ok) throw new Error('Failed to delete');})
      .then(() => getAllInstanceFromDB())
      .catch(error => { setData(null); console.log(error) });
  }

  return (
    <div className='containerApp'>
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} getInstanceFromDB={getInstanceFromDB} getAllInstanceFromDB={getAllInstanceFromDB} setShowCreatePopUp={setShowCreatePopUp}/>
      <ContentTable data={data} viewNumber={listNumber[indexNumber]} startItemIndex={startItemIndex} deleteInstanceFromDB={deleteInstanceFromDB} updateInstanceFromDB={updateInstanceFromDB}   columnsAdd={columnsAdd}/>
      <PageChanger numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} onPageChange={onPageChange}/>
      {showCreatePopUp && (<CreatePopUp setShowCreatePopUp={setShowCreatePopUp} columnsAdd={columnsAdd} createInstanceFromDB={createInstanceFromDB}/>)} 
    </div>
  )
}

export default App;