import { useEffect, useState, useCallback } from "react";
import { getCourses } from "../data/data";
import Course from "../components/Course";
import { useNavigate } from "react-router-dom";
import { Navbar,Nav, Row, Col } from "react-bootstrap"; // Import Row and Col from Bootstrap
import Logo from '../styles/canvas.webp';
import "../styles/pages.css"

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      navigate('/error');
      console.error("Error fetching courses:", error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <>
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand className="navbar-brand" href="/">
          <img src={Logo} className="navbar-logo" alt="canvas" />
        </Navbar.Brand>
        <Nav className="ml-auto"> {/* Use ml-auto to align items to the right */}
          <Nav.Link className="navbar-item" href="/">Virtual Canvas Shell</Nav.Link> {/* Add your additional item */}
          {/* You can add more Nav.Link items here */}
        </Nav>
      </Navbar>
      <div className="courses-heading">
        <h1 style={{ fontSize: '4rem' }}>My Courses</h1>
        <hr />
        <Row>
          {courses.map((course, index) => (
            <Col key={index} lg={4} md={6} sm={12} > {/* Use Bootstrap Col with size 4 for large screens */}
              <Course course={course} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Courses;
