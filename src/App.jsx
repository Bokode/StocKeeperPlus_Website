import './App.css'
import ContentTable from './components/contentTable/contentTable';
import Topbar from './components/topBar/topBar';
import { useState, useEffect } from 'react';

function App() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [data, setData] = useState(null)

  useEffect(() => {
    handleClick()
  }, [indexTable]);

  function handleClick() {
    const tableToSearch = listTable[indexTable][0].toLocaleLowerCase() + listTable[indexTable].slice(1);

    fetch('http://localhost:3001/' + tableToSearch + '/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {setData(null); console.log(error)});
  }

  return (
    <div className='containerApp'>
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} handleClick={handleClick}/>
      <ContentTable data={data} viewNumber={listNumber[indexNumber]}/>
    </div>
  )
}

export default App;