import { Container, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { linkAccount} from '../database/api';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/reducers';
import VR from "../assets/images/vr.gif"
import Logo from "../assets/images/canvas.webp"
import RMIT from"../assets/images/rmit.png"
import Hubs from "../assets/images/Hubs.png"
import "../assets/styles/components.css"
import "../assets/styles/pages.css"

const Signup = () => {
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [token, setNewToken] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem("token")

  useEffect(() => {
    // Check if token exists in localStorage when component is first rendered
    if (storedToken && storedToken.trim() !== "") {
      navigate("/courses"); // Redirect to course page if token exists
    }
  }, [navigate,storedToken]);

  const handleSignup = async () => {
    setIsLoading(true); // Set loading state to true during login request
    try {
      await linkAccount(id, password,token);
      dispatch(setToken(token));
      navigate("/courses")
    } catch (error) {
      setErrorMessage(error.message);
    } 
  };

  return (
    <Container className='full-width-height'>
      <Row>
          <Col md={6}  className='login-image-section' >
            <img src={VR} className='login-image' alt=''/>
            </Col>
          <Col md={6} className='login-form-section'>
            <Container  className='login-form-container'>
            <img src={RMIT} className='company-img-logo' alt=''/>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                  <div className="mt-5">
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
                  <div className="mt-5">
                    <input
                      type="text"
                      placeholder="Enter Canvas Token"
                      value={token}
                      className='login-input-style'
                      onChange={(e) => setNewToken(e.target.value)}
                    />
                  </div>
                  <div className="text-center mt-5">
                    <Button
                      variant="danger"
                      className='login-button-style'
                      onClick={handleSignup}
                      disabled={isLoading} // Disable the button during loading
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Link Account"
                      )}
                    </Button>
                    <br/>
                    <p className='text-style'>
                      Already Have an Account?{' '}
                      <a href="/" className='link-style'> Sign In </a>
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

export default Signup;
