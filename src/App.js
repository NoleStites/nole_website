import logo from './logo.svg';
import './App.css';

function MyButton({my_param}) {
  return (
    <button>
      I'm a {my_param}
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <MyButton my_param={"ButtonParam"}/>
      </header>
    </div>
  );
}

export default App;
