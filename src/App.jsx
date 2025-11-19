import './App.css'
import ContentTable from './components/contentTable/contentTable';
import PageChanger from './components/pageChanger/pageChanger';
import Topbar from './components/topBar/topBar';
import { useState, useEffect } from 'react';

function App() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [startItemIndex, setStartItemIndex] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    getAlllInstanceFromDB()
  }, [indexTable]);

  function onPageChange(i) {
    setStartItemIndex((i-1)*listNumber[indexNumber]);
  }

  function getAlllInstanceFromDB() {
    fetch('http://localhost:3001/' + listTable[indexTable] + '/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {setData(null); console.log(error)});
  }

  function getInstanceFromDB(id) {
    const firstColumnKey = Object.keys(data[0])[0];

    fetch('http://localhost:3001/' + listTable[indexTable] + '/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [firstColumnKey]: id })
    })
      .then(response => response.json())
      .then(json => setData([json]))
      .catch(error => { setData(null); console.log(error) });
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
      .then(() => {getAlllInstanceFromDB();})
      .catch(error => { setData(null); console.log(error) });
  }

  return (
    <div className='containerApp'>
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} getInstanceFromDB={getInstanceFromDB}/>
      <ContentTable data={data} viewNumber={listNumber[indexNumber]} startItemIndex={startItemIndex} deleteInstanceFromDB={deleteInstanceFromDB}/>
      <PageChanger numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} onPageChange={onPageChange}/>
    </div>
  )
}

export default App;