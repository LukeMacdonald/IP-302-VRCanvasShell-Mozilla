import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { setToken } from '../storage/reducers';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
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
      <h2>Login</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form>
        <Form.Group controlId="token">
          <Form.Label>Token</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your token"
            value={token}
            onChange={(e) => setNewToken(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;