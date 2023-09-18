import React, { useState} from 'react';
import { Container, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { signIn } from '../storage/api';

const Login = () => {
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true during login request
    try {
      await signIn(id, password);
      navigate("/courses")
    } catch (error) {
      setErrorMessage('Invalid Credentials');
    } finally {
      setIsLoading(false); // Reset loading state after login request completes
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
              placeholder="Enter RMITID or Email"
              value={id}
              style={{ height: '50px', width: '100%' }}
              onChange={(e) => setID(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              style={{ height: '50px', width: '100%' }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-center mt-5">
            <Button
              variant="danger"
              style={{ width: "90%", height: '50px' }}
              onClick={handleLogin}
              disabled={isLoading} // Disable the button during loading
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

