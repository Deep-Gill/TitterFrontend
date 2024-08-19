import React from 'react';
import { useRef, useState, useEffect } from 'react';
import './SignUp.css';
import axios from '../../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/sign-up';

export default function SignUp() {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [userExists, setUserExists] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        if (validName) {
            doesUserExist(user)
                .then((result) => {
                    console.log(result);
                    setUserExists(result);
                })
                .catch((err) => {
                    console.error(err);
                    setUserExists(false);
                });
        } else {
            setUserExists(false);
        }
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = pwd === matchPwd;
        if (!v1 || !v2 || !v3) {
            setErrMsg('Invalid input. Please check the notes below the fields.');
            return;
        }
        console.log(user, pwd);
        try {
            await createUser(user, pwd);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response.');
            } else if (err.response?.status === 409) {
                setErrMsg('Username already exists.');
            } else {
                setErrMsg('Registration Failed.');
            }
            errRef.current.focus();
            console.error(err);
        };
    };

    const doesUserExist = async (username) => {
        try {
            const response = await axios.get(`/users/${username}`);
            //let data = JSON.stringify({ "username": username });
            //const response = await axios.get(`/user`, data, { headers: { 'Content-Type': 'application/json' } });
            //let data = { username: username };
            //const response = await axios.get(`/user`, data);
            console.log(response);
            return response.data.length > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const createUser = async (username, password) => {
        try {
            const date = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
            const dateStr = `${date.year}-${date.month}-${date.day}`;
            const body = JSON.stringify({ "username": username, "password": password, "email": '', "role": 0, "date": dateStr });
            const headers = { 'Content-Type': 'application/json' };
            const response = await axios.post('/users', body, { headers: headers });
            console.log(response);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {success ? (
                <section className="register-section">
                    <h1>Success!</h1>
                    <p>
                        <a href="/">Sign in</a>
                    </p>
                </section>) : (
                <section className="register-section">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errMsg}
                    </p >
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                            <span className={validName && !userExists ? "valid" : "hide"}>
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <span className={user && (userExists || !validName) ? "invalid" : "hide"}>
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autocomplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            aria-invalid={!validName || userExists}
                            aria-describedby="uidnote"
                        />
                        <p id="uidnote" className={userFocus && validName && userExists ? "note" : "offscreen"}>
                            <i class="fa-solid fa-circle-info"></i>
                            Username already exists. <br />
                        </p>
                        <p id="uidnote" className={userFocus && user && !validName ? "note" : "offscreen"}>
                            <i class="fa-solid fa-circle-info"></i>
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Only letters, numbers, hyphens, and underscores allowed.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <span className={validPwd ? "valid" : "hide"}>
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            aria-invalid={!validPwd}
                            aria-describedby="pwdnote"
                        />
                        <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "note" : "offscreen"}>
                            <i class="fa-solid fa-circle-info"></i>
                            8 to 24 characters. <br />
                            Must include at least one uppercase and lowercase letter, number, and special character. <br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            aria-invalid={!validMatch}
                            aria-describedby="confirmnote"
                        />
                        <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "note" : "offscreen"}>
                            <i class="fa-solid fa-circle-info"></i>
                            Must match the password above.
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch || userExists}>Sign Up</button>
                    </form>

                    <p>
                        Already registered? <br />
                        <span className="line">
                            { }
                            <a href="/">Sign in</a>
                        </span>
                    </p>
                </section >
            )}
        </>
    )
}