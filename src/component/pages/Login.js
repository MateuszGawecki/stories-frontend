import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Navigate } from "react-router-dom";

async function loginUser(username, password) {
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': "*/*"
        },
        body: new URLSearchParams({
            'username': username,
            'password': password
        })
    })
    .then((response) => response.json())
    .then((body) => {
        return body;
    });
};

function Login({ setToken }) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const tokens = await loginUser(username, password);
        setToken(tokens);
    }

    return (
        <div className="login-wrapper">
            <p>Logo Apki</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Login</button>
                    {/* <Link to="/register">Register</Link> */}
                </div>
            </form>
        </div>
    );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Login;