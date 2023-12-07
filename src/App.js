import './App.css';
import TaskList from "./components/TaskList.js";
import Navbar from './components/NavBar.js';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <TaskList/>
    </div>
  );
}

export default App;
