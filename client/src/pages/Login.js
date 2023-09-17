import React, { useState } from 'react';
import { Container, Button, Alert, Row, Col } from 'react-bootstrap';
import { setToken } from '../redux/reducers';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
  const [token, setNewToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (token.trim() !== ""){
      dispatch(setToken(token));
      navigate("/courses")
    } 
    else {
      // Display an error message for an invalid token
      setErrorMessage('Token must be entered!');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '8rem' }} />
        <Col xs={12} md={6} className="mt-5">
          <h1 style={{ fontSize: '3rem', fontWeight: '600' }}>Sign In</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <div className="mt-5">
            <input
              type="text"
              placeholder="Enter your token"
              value={token}
              style={{ height: '50px', width: '100%' }}
              onChange={(e) => setNewToken(e.target.value)}
            />
          </div>
          <div className="text-center mt-5">
            <Button
              variant="danger"
              style={{ width: "90%", height: '50px' }}
              onClick={handleLogin} 
            > Submit Token
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

