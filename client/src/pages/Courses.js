import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCourse, clearCourses, clearToken, setMyCourses } from "../redux/reducers";
import { Row, Col, Container,Button } from "react-bootstrap";
import Course from "../components/Course";
import "../assets/styles/pages.css";
import { getCourses, getProfile } from "../database/api";
import Navbar from "../components/Navbar";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      const foundUser = await getProfile();
      setUser(foundUser);
      const coursesData = await getCourses();
      setCourses(coursesData);
      dispatch(setMyCourses(coursesData));
    } catch (error) {
      navigate("/error");
      console.error("Error fetching courses:", error);
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleLogout = (() => {
    dispatch(clearCourse());
    dispatch(clearCourses());
    dispatch(clearToken());
    navigate("/")
  })

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
          </Container>
          <Container className="text-center" style={{marginBottom:'2rem'}}>
            <Button
              type="submit"
              variant="danger"
              style={{ width: "75%" }}
              onClick={handleLogout}
            >Logout
            </Button>
          </Container>
        </Col>
        <Col md={8}>
          <Container style={{ textAlign: "left", marginTop: "3rem", width: "100%" }}>
            <h1>My Courses</h1>
            <hr />
            <div
              style={{
                maxHeight: "65vh", // Set a maximum height for the scrollable area
                overflowY: "auto", // Enable vertical scrolling if content exceeds maxHeight
                overflowX: "hidden", // Disable horizontal scrolling
              }}
            >
              <Row>
                {courses.map((course, index) => (
                  <Col key={index} lg={6} md={12}>
                    <Course course={course} />
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </Col>
      </Row>
    </>
  );
}
export default Courses;