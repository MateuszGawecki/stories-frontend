import './App.css';
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Books from './component/pages/Books';
import PageNotFound from './component/pages/PageNotFound';
import People from './component/pages/People';
import Settings from './component/pages/Settings';
import Library from './component/pages/Library';
import Login from './component/pages/Login';
import Register from './component/pages/Register';
import Navbar from "./component/nav/Navbar";
import Layout from './component/pages/Layout';
import Unauthorized from './component/pages/Unauthorized';
import RequireAuth from './component/RequireAuth';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={["user"]}/>}>
          <Route path="/" element={<Books />} />
          <Route path="/books" element={<Books />} />
          <Route path="/library" element={<Library />} />
          <Route path="/people" element={<People />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
