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

function App() {
  const [token, setToken] = useState();

  if(!token){
    return <Login setToken={setToken} />
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/library' element={<Library/>}/>
          <Route exact path='/people' element={<People/>}/>
          <Route exact path='/settings' element={<Settings/>}/>
          <Route exact path='/books' element={<Books/>}/>
          <Route exact path='/register' element={<Register/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
