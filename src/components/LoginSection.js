import React from 'react'
import { Button } from './Button'
import './LoginSection.css'
import '../App.css'

function LoginSection() {
    return (
        <div className='login-container'>
            <h1>SIGN UP</h1>
            <div className='input-areas'>
                <form>
                    <input type='name' name='name' placeholder='Name' className='user-name-input' />
                    <input type='password' name='password' placeholder='Password' className='user-pswd-input' />
                </form>
            </div>
            <div className='sign-up-btns'>
                <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                    SIGN UP
                </Button>
            </div>
        </div>
    );
}

export default LoginSection;