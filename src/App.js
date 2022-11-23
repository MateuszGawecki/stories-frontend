import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Books from './component/pages/books/Books';
import PageNotFound from './component/pages/PageNotFound';
import People from './component/pages/people/People';
import Settings from './component/pages/settings/Settings';
import Library from './component/pages/library/Library';
import Login from './component/pages/login/Login';
import Register from './component/pages/register/Register';
import Layout from './component/pages/Layout';
import Unauthorized from './component/pages/Unauthorized';
import RequireAuth from './component/RequireAuth';
import PersistLogin from './component/PersistLogin';
import AddBook from './component/pages/manage/AddBook';
import ManageAuthor from './component/pages/manage/ManageAuthor';
import ManageGenre from './component/pages/manage/ManageGenre';
import ModifyBook from './component/pages/manage/ManageBook';
import ManageUsersRoles from './component/pages/manage/ManageUsersRoles';
import UserDetails from './component/pages/people/UserDetails';
import AppLogs from './component/pages/manage/AppLogs';

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
            <Route path="/users/:id" element={<UserDetails />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["moderator"]}/>}>
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/authors/manage" element={<ManageAuthor />} />
            <Route path="/genres/manage" element={<ManageGenre />} />
            <Route path="/books/:id" element={<ModifyBook/>} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]}/>}>
            <Route path="/people/roles/manage" element={<ManageUsersRoles />} />
            <Route path="/logs" element={<AppLogs />} />
          </Route>
          
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
