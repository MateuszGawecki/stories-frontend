import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthProvider";
import axios from '../../api/axios';

const LOGIN_URL = '/api/login'

function Login() {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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
                new URLSearchParams({
                    'username': email,
                    'password': password
                },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                })
            );

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({ email, password, roles, accessToken });

            setEmail('');
            setPassword('');
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
        <>
        {success ? (
            <section>
                <h1>You are logged in!</h1>
                <br />
                <p>
                    <a href="#">Go to Home</a>
                </p>
            </section>
        ) : (
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
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
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
                </form>

                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <a href="#">Sign Up</a>
                    </span>
                </p>
            </section>
        )}
        </>
    );
};


export default Login;