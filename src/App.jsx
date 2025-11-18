import './App.css'
import ContentTable from './components/contentTable/contentTable';
import PageChanger from './components/pageChanger/pageChanger';
import Topbar from './components/topBar/topBar';
import ConfirmationPopUp from './components/confirmationPopUp/confirmationPopUp';
import { useState, useEffect } from 'react';


function App() {
  const listTable = ["Food", "FoodUser", "User", "IngredientAmount", "Recipe", "Store", "FoodStore"];
  const listNumber = [5, 10, 20, 51];
  const [indexTable, setIndexTable] = useState(0);
  const [indexNumber, setIndexNumber] = useState(0);
  const [startItemIndex, setStartItemIndex] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    handleClick()
  }, [indexTable]);

  function onPageChange(i) {
    setStartItemIndex((i-1)*listNumber[indexNumber]);
  }

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
      <ContentTable data={data} viewNumber={listNumber[indexNumber]} startItemIndex={startItemIndex}/>
      <PageChanger numberPage={Math.ceil(data?.length/(listNumber[indexNumber])) || 0} onPageChange={onPageChange}/>
      <ConfirmationPopUp />
    </div>
  )
}

export default App;