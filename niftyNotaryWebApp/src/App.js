import React from 'react';
import logo from './logo.svg';
import './App.css';

// @todo pull in material
// make it a nice but dumb front end that more or less copies existing options
// dl file with details
// mebs a zip package
// drag and drop

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
      </header>
    </div>
  );
}

export default App;
