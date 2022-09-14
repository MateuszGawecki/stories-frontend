import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "../../api/axios";

const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = 'api/user/register';

const Register = () => {
    const emailRef = useRef();
    const errRef = useRef();
    
    const [name, setName] = useState('');
    const [nameFocus, setNameFocus] = useState(false);

    const [surname, setSurname] = useState('');
    const [surnameFocus, setSurnameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({name, surname, email, password}),
                {
                    headers: { 'Content-Type': 'application/json'}
                }
            );

            setSuccess(true);

        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    };

    return (
        <>
        { success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        Name:
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        onChange={(e) => setName(e.target.value)} 
                        requied 
                        onFocus={() => setNameFocus(true)} 
                        onBlur={() => setNameFocus(false)} 
                    />

                    <label htmlFor="surname">
                        Surname:
                    </label>
                    <input 
                        type="text" 
                        id="surname" 
                        onChange={(e) => setSurname(e.target.value)} 
                        requied
                        onFocus={() => setSurnameFocus(true)} 
                        onBlur={() => setSurnameFocus(false)} 
                    />

                    <label htmlFor="email">
                        Email:
                        <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                    </label>
                    <input 
                        type="text" 
                        id="email" 
                        ref={emailRef} 
                        autoComplete="off" 
                        onChange={(e) => setEmail(e.target.value)} 
                        requied 
                        aria-invalid={validEmail ? "false" : "true"} 
                        aria-describedy="uidnote" 
                        onFocus={() => setEmailFocus(true)} 
                        onBlur={() => setEmailFocus(false)} 
                    />
                    <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Email must contain '@' character and must be existing email.
                    </p>


                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        aria-invalid={validPassword ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                    />
                    <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: 
                        <span aria-label="exclamation mark">!</span> 
                        <span aria-label="at symbol">@</span> 
                        <span aria-label="hashtag">#</span> 
                        <span aria-label="dollar sign">$</span> 
                        <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

                    <button disabled={!validEmail || !validPassword || !validMatch ? true : false}>Sign Up</button>
                </form>

                <p>
                            Already registered?<br />
                            <span className="line">
                                {/*put router link here*/}
                                <a href="#">Sign In</a>
                            </span>
                        </p>
            </section>
        )} 
        </>
    );
};

export default Register;