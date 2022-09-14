import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import React, { useState } from 'react';

import Books from './component/pages/Books';
import PageNotFound from './component/pages/PageNotFound';
import People from './component/pages/People';
import Settings from './component/pages/Settings';
import Library from './component/pages/Library';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Navbar from "./component/nav/Navbar";

function App() {
  const [access_token, setAccessToken] = useState(null);
  const [refresh_token, setRefreshToken] = useState(null);

  function setTokens(tokens){
    setAccessToken(tokens["access_token"]);
    setRefreshToken(tokens["refresh_token"]);
    console.log(tokens["access_token"]);
    console.log(tokens["refresh_token"]);
  }

  // if(!access_token){
  //   return <Login setToken={setTokens} />
  // }

  return (
    <Router>
      <div className="App">
      <Navbar/>
        <Routes>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/library' element={<Library/>}/>
          <Route exact path='/people' element={<People/>}/>
          <Route exact path='/settings' element={<Settings/>}/>
          <Route exact path='/register' element={<Register/>}/>
          <Route exact path='/books' element={<Books/>}/>
          <Route exact path='/' element={<Books/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
