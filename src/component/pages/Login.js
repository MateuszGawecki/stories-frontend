import { useRef, useState, useEffect } from 'react';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

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
            const roles = JSON.parse(response?.data?.roles);

            setAuth({ email, password, roles, accessToken });

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
        <section>
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
            </form>

            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link> 
                </span>
            </p>
        </section>
    );
};


export default Login;