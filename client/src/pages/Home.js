import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import "../assets/styles/pages.css";
import { getProfile } from "../database/api";
import Navbar from "../components/Navbar";
import LogoutButton from "../components/LogoutButton";
import Courses from "../components/Courses";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const storedToken = localStorage.getItem("token")
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (storedToken  && storedToken.trim() === "") {
          navigate("/"); // Redirect to course page if token exists
        }
        // Make the first request
        const foundUser = await getProfile();
        setUser(foundUser);
        // Handle someData as needed
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchProfile();
  }, );

  return (
    <>
      <Navbar />
      <Row style={{ height: "91vh", maxWidth:'100%'}}>
        <Col md={3} className="create-room-left-col">
          <Container style={{ margin: "3rem 0 0 0" }}>
            <h1>Account Details:</h1>
            <hr />
            <Container className="room-details-container">
              <h5 style={{marginTop:'1rem'}}><b>Personal Info:</b></h5>
              <h6 style={{marginLeft:'0.5rem'}}>{user?.name} ({user?.login_id})</h6>
              <h5 style={{marginTop:'1rem'}}><b>Contact:</b></h5>
              <h6 style={{marginLeft:'0.5rem'}}>{user?.primary_email}</h6>
            </Container>     
            <LogoutButton/>
          </Container>
        </Col>
        <Courses/> 
      </Row>
    </>
  );
}
export default Home;