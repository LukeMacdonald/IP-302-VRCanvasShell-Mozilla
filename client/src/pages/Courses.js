import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setMyCourses } from '../redux/reducers'

import { Row, Col } from "react-bootstrap"; // Import Row and Col from Bootstrap
import Course from "../components/Course";
import "../styles/pages.css"
import { getCourses } from "../storage/api";
import Navbar from "../components/Navbar";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
      dispatch(setMyCourses(coursesData));

    } catch (error) {
      navigate('/error');
      console.error("Error fetching courses:", error);
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <>
      <Navbar/>
      <div className="courses-heading">
        <h1 style={{ fontSize: '4rem' }}>My Courses</h1>
        <hr />
        <Row>
          {courses.map((course, index) => (
            <Col key={index} lg={4} md={6} sm={12} >
              <Course course={course}/>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Courses;

