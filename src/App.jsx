import './App.css'
import Topbar from './components/topBar/topBar';
import Calendar from './components/calendar/ExpiryCalendar.jsx'

function App() {
  return (
    <div className='appContainer'>
      <Topbar />
      <Calendar />
    </div>
  )
}

export default App;