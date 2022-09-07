import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from './component/nav/Navbar.js';
import Books from './component/pages/Books';
import PageNotFound from './component/pages/PageNotFound';
import People from './component/pages/People';
import Settings from './component/pages/Settings';
import Library from './component/pages/Library';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route exact path='/library' element={<Library/>}/>
          <Route exact path='/people' element={<People/>}/>
          <Route exact path='/settings' element={<Settings/>}/>
          <Route exact path='/' element={<Books/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
