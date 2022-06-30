import { 
  BrowserRouter
  //Route,
  //Switch 
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import { 
  authenticate
} from './components/utils/genesysCloudUtils';
import { Home } from './components/home/Home.component'

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
    <BrowserRouter>
      <div>
        <Home></Home>
      </div>
    </BrowserRouter>
  );
}

export default App;
