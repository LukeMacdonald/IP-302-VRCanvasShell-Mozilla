import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { setToken } from '../redux/reducers';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'

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
        <Col xs={12} md={6}>
          <h1 style={{ fontSize: '4rem' }}>Welcome</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form className="mt-5">
            <Form.Group controlId="token">
              <Form.Control
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setNewToken(e.target.value)}
              />
            </Form.Group>
            <div className="text-center mt-5">
              <Button
                type="submit"
                variant="danger"
                style={{ width: "90%" }}
                onClick={handleLogin} 
              > Submit Token
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
