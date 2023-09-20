import React from 'react';
import Logo from '../assets/images/canvas.webp';
import RMIT from '../assets/images/rmit.png'
import "../assets/styles/pages.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="https://canvas-hub.com" style={{ marginLeft: '2rem' }}>
        <img src={Logo} className="d-inline-block align-top navbar-logo" alt="" />
      </a>
      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li style={{marginLeft:'1rem'}}> 
            <p className="navbar-item"><a href='/#/courses' style={{textDecoration:'none', color:'white'}}>Home</a></p>
          </li>
          <li style={{marginLeft:'2rem'}}> 
            <p className="navbar-item"><a href='https://canvas-hub.com' style={{textDecoration:'none', color:'white'}}>Hubs</a></p>
          </li>
        </ul>
        <div style={{ marginRight: '2rem' }}> 
          <img src={RMIT} width="120px" height="40px" style={{ marginRight: '2rem' }} className="d-inline-block align-top" alt="" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;