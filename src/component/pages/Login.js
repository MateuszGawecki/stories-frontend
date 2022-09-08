import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

async function loginUser(username, password) {
    return fetch('http://localhost:8080/api/login', {
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
    .then(data => {
        try {
            console.log(data.json());
        } catch (error) {
            console.log('Dupa');
        }
    });
};

function Login({ setToken }) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser(username, password);
        // setToken(token);
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