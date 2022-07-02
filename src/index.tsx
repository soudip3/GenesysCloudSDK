import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { clientConfig } from './config';
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const { clientId, redirectUri } = clientConfig;
const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.com")
client.loginImplicitGrant(clientId, redirectUri)
.then((data:any)=>{
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})
.catch((err:any)=>{
  console.log(`${err.status} - ${err.error.message}`);
    console.log(err.error);
})
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
