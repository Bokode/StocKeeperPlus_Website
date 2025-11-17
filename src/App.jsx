import './App.css'
import ContentTable from './components/contentTable/contentTable';
import Topbar from './components/topBar/topBar';
import { useState } from 'react';

function App() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 50];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [data, setData] = useState(null)

  function handleClick() {
    fetch('http://localhost:3001/food/all')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));

    console.log(data);
  }

  return (
    <div className='containerApp'>
      <Topbar listTable={listTable} listNumber={listNumber} indexTable={indexTable} indexNumber={indexNumber} setIndexTable={setIndexTable} setIndexNumber={setIndexNumber} handleClick={handleClick}/>
      <ContentTable/>
    </div>
  )
}

export default App;