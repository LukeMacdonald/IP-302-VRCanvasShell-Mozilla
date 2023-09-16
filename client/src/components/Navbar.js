import React from 'react';
import Logo from '../styles/canvas.webp';
import RMIT from '../styles/rmit.png'
import '../styles/pages.css'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="https://canvas-hub.com" style={{ marginLeft: '2rem' }}>
        <img src={Logo} className="d-inline-block align-top navbar-logo" alt="" />
      </a>
      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li>
            {/* Show "Profile" link if user is logged in */}
            <p className="navbar-item">Virtual Canvas Shell</p>
          </li>
        </ul>
        <div style={{ marginRight: '2rem' }}>
          {/* Show "Sign in" and "Sign up" buttons if user is not logged in */}
          <img src={RMIT} width="120px" height="40px" style={{ marginRight: '2rem' }} className="d-inline-block align-top" alt="" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;