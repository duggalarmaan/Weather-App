import logo from './logo.svg';
import './App.css';
import Weather from './Weather'; // Import your Weather component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <Weather /> {/* Use your Weather component here */}
      </header>
    </div>
  );
}

export default App;
