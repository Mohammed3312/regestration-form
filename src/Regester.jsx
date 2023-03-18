import React from 'react'
import { useState, useRef , useEffect } from 'react'
import { faCheck , faTimes , faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from './api/Axios';



const User_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

const Regester = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd,] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus()
    },[]);

    useEffect(()=>{
        const result = User_REGEX.test(user);
        console.log(user);
        console.log(result);
        setValidName(result)
    },[user]);

    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
        console.log(pwd);
        console.log(result);
        const match = pwd === matchPwd;
        setValidMatch(match)
        setValidPwd(result)
    },[pwd,matchPwd]);

    useEffect(()=>{
        setErrMsg('');
    },[user,pwd,matchPwd])

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const v1 = User_REGEX.test(user)
        const v2 = PWD_REGEX.test(pwd)
        if(!v1 || !v2){
            setErrMsg('Invalid Entery')
            return;
        } 
        try{
            const response = await Axios.post(REGISTER_URL ,
                JSON.stringify({user , pwd}),
                {
                    headers:{'content-type':'application/json'},
                    withCredentials:true
                }
                );
                console.log(response.data)
                console.log(response.accessToken)
                console.log(JSON.stringify(response))
                setSuccess(true)
        } catch (err){
            if(!err?.response){
                setErrMsg('No Server Response')
            }else if (err.response?.status === 409){
                setErrMsg('Username Taken')
            } else {
                setErrMsg('Registration failed')
            }
            errRef.current.focus();
        }
    }


return (
    <>
    {success?(<section>
        <h1>Success!</h1>
        <a href="#">Sign In</a>
    </section>):(
    <section>
        <p
        ref={errRef} className ={errMsg?'errmsg':'offscreen'} aria-live='assertive'>{errMsg}</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            {/* start of username  */}
            <label htmlFor="username">
                Username:
                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
            </label>
            <input type="text" 
            id='username'
            ref={userRef}
            autoComplete='off'
            onChange={(e)=>setUser(e.target.value)}
            required
            aria-invalid={validName?'false':'true'}
            aria-describedby = 'uidnote'
            onFocus={()=> setUserFocus(true)}
            onBlur={()=>setUserFocus(false)}
            />
            <p
            id='uidnote' className={userFocus&&user&&!validName?'instructions':'offscreen'}
            >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters. <br />
                Must begin With a letter <br />
                Letter,numbers,underscores,hyphens allowed.
            </p>
                {/* end of usrname */}
                {/* start of password */}
                <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> 
                            <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        {/* end of password */}
                        {/* password validation */}
                        <label htmlFor="confirm-pass">
                            confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch&&matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm-pass"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="pwdnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password feild.
                        </p>
                        {/* end of password validation */}
                        {/* sign in button */}
                        <button disabled={!validName || !validMatch || !validPwd ?true:false}>
                            Sign In
                        </button>
        </form>
        <p>
            Aleady Registed<br/>
            <span className='line'>
                <a href="#">Sign In</a>
            </span>
        </p>
    </section>
    )}
    </>
)
}

export default Regester