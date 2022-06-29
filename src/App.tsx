import { 
  BrowserRouter,
  Route,
  //Switch 
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
  authenticate
} from './utils/genesysCloudUtils';

function App() {
  useEffect(() => {
    getPlatformClientData();
  }, []);

  async function getPlatformClientData() {
    await authenticate()
    .then((data:any)=>{
      console.log('AUTH',data)
    })
    .catch((err:any)=>{
      console.log(err)
    })
    
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
