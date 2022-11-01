import "./Login.css";

import { useRef, useState, useEffect } from 'react';
import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../../hooks/useInput';
import useToggle from '../../../hooks/useToggle';

const LOGIN_URL = '/api/login';

function Login() {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, emailReset, emailAttributeObj] = useInput('email','');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                new URLSearchParams({'username': email, 'password': password }),
                {
                    withCredentials: true,
                    credentials: "include",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                }
            );

            const accessToken = response?.data?.access_token;

            setAuth({ email, accessToken });

            emailReset();
            setPassword('');
            navigate(from, {replace: true});
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <div className="logindiv">
        <svg className="imglogin" xmlns="http://www.w3.org/2000/svg" width="537" height="108" viewBox="0 0 537 108">
            <text id="Stories" transform="translate(0 85)" fill="#fff" font-size="88" font-family="LatinWide, Wide Latin"><tspan x="0" y="0">Stories</tspan></text>
        </svg>

        <section className="loginsection">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='email'>Email:</label>
                <input 
                    type="text" 
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    {...emailAttributeObj}
                    required
                />

                <label htmlFor='password'>Password:</label>
                <input 
                    type="password" 
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />

                <div className="signindiv">
                    <button>Sign In</button>
                    <div className='persistCheck'>
                        <input 
                            type="checkbox"
                            id='persist'
                            onChange={toggleCheck}
                            checked={check}
                        />
                        <label htmlFor='persist'>Trust This Device</label>
                    </div>
                </div>
            </form>

            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link> 
                </span>
            </p>
        </section>
        </div>
    );
};


export default Login;