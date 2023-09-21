import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import this if you want to redirect the user after logout
import { clearCourse, clearCourses, clearToken } from '../redux/reducers';
import { Button,Container } from 'react-bootstrap';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearToken());
    dispatch(clearCourses());
    dispatch(clearCourse());

    // Clear local storage
    localStorage.removeItem('token');
    
    // Redirect to the login page or any other desired page after logout
    navigate('/');
  };

  return (
    <Container className="text-center" style={{marginBottom:'2rem'}}>
      <Button variant="danger" style={{ width: "75%" }} onClick={handleLogout}>Logout</Button>
    </Container>
  );
}

export default LogoutButton;