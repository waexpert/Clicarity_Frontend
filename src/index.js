// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter,Route,Routes,Link } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import {store} from "./store/store"

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//   <BrowserRouter>
//     <App />
//     </BrowserRouter>
//     </Provider>
// );

// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store'; // Import store and persistor from store
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate from redux-persist

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
