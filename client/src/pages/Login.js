import React, { useState} from 'react';
import { Container, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css'
import { signIn } from '../storage/api';
import VR from '../styles/MetaVerse.avif'
import Logo from '../styles/canvas.webp'
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
    <Container style={{height:'100vh', minWidth: '100%'}}>
      <Row>
          <Col lg={6} style={{margin:'0 auto', textAlign:'center', backgroundColor:'#EAEAEA'}} >
            <img src={VR} style={{margin:'2rem',width:'85%',height:'40rem', marginTop:'5rem', borderRadius:'33%'}} alt=''/>
            </Col>
          <Col lg={6} style={{backgroundColor:'#323232', height:'100vh'}}>
            <Container style={{width:'70%', marginTop:'5rem'}}>
                  <img src={Logo} style={{width:'6rem'}} alt=''/>
                  <h1 style={{fontWeight: '600', marginTop:'2rem', color:'white' }}>Welcome Back</h1>
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
                      type="text"
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
                    <a href='/signin'>Don't Already Have an Account?</a>
                  </div>
                  </Container>
                </Col>
              </Row>
            </Container>
)};

export default Login;

