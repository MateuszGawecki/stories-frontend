import './App.css';
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Books from './component/pages/books/Books';
import PageNotFound from './component/pages/PageNotFound';
import People from './component/pages/People';
import Settings from './component/pages/settings/Settings';
import Library from './component/pages/library/Library';
import Login from './component/pages/login/Login';
import Register from './component/pages/register/Register';
import Layout from './component/pages/Layout';
import Unauthorized from './component/pages/Unauthorized';
import RequireAuth from './component/RequireAuth';
import PersistLogin from './component/PersistLogin';
import AddBook from './component/pages/AddBook';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["user"]}/>}>
            <Route path="/" element={<Books />} />
            <Route path="/books" element={<Books />} />
            <Route path="/library" element={<Library />} />
            <Route path="/people" element={<People />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* sciezki pod inne role*/}
          <Route element={<RequireAuth allowedRoles={["moderator"]}/>}>
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/books/:id" element={<AddBook />} />
          </Route>
          
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
