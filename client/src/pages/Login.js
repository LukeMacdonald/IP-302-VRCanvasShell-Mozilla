import React, { useState} from 'react';
import { Container, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'
import '../styles/pages.css'
import { signIn } from '../storage/api';
import VR from '../styles/MetaVerse.avif'
import Logo from '../styles/canvas.webp'
import RMIT from '../styles/rmit.png'
import Hubs from '../styles/Hubs.png'
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/reducers';

const Login = () => {
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true during login request
    try {
      const token = await signIn(id, password);
      console.log(token);
      dispatch(setToken(token));
      navigate("/courses")
    } catch (error) {
      setErrorMessage('Invalid Credentials');
    } finally {
      setIsLoading(false); // Reset loading state after login request completes
    }
  };

  return (
    <Container className='full-width-height'>
      <Row>
          <Col md={6} className='login-image-section' >
            <img src={VR} className='login-image' alt=''/>
            </Col>
          <Col md={6} className='login-form-section'>
            <Container className='login-form-container'>
              <img src={RMIT} className='company-img-logo' alt=''/>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <div className='mt-5'>
                    <input
                      type="text"
                      placeholder="Enter RMITID or Email"
                      value={id}
                      className='login-input-style'
                      onChange={(e) => setID(e.target.value)}
                    />
                  </div>
                  <div className="mt-5">
                    <input
                      type="text"
                      placeholder="Enter Password"
                      value={password}
                      className='login-input-style'
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-center mt-5">
                    <Button
                      variant="danger"
                      className='login-button-style' 
                      onClick={handleLogin}
                      disabled={isLoading} // Disable the button during loading
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                    <br/>
                    <p className='text-style'>
                      Don't Already Have an Account?{' '}
                      <a
                        href="/#/signin"
                        className='link-style'
                      > Sign Up </a>
                    </p>
                  </div>
                  <Container className='mt-5'>
                    <Row>
                      <Col >
                      <a href='https://canvas-hub.com'><img src={Hubs} className='canvas-logo' alt='hubs'/></a>
                      </Col>
                    
                      <Col>
                      <a href='https://rmit.instructure.com/'><img src={Logo} className='canvas-logo' alt='canvas'/></a>
                      </Col>
                    </Row>
                  </Container>
                  </Container>
                </Col>
              </Row>
            </Container>
)};

export default Login;
