import { useEffect, useState, useCallback } from "react";
import { getCourses } from "../data/data";
import Course from "../components/Course";
import { useNavigate } from "react-router-dom";
import { Navbar } from "react-bootstrap";
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
      </Navbar>
      <div className="courses-heading">
        <h1>Courses</h1>
        <ul>
          {courses.map((course, index) => (
            <Course key={index} course={course} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Courses;
