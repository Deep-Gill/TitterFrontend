import React from 'react'
import { Button } from './Button'
import './HeroSection.css'
import '../App.css'

function HeroSection() {
    return (
        <div className='hero-container'>
            <video src='/videos/video-3.mp4' autoPlay loop muted />
            <h1>Join Today</h1>
            <div className='hero-btns'>
                <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                    SIGN UP
                </Button>
                <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                    SIGN IN
                </Button>
            </div>
        </div>
    );
}

export default HeroSection;