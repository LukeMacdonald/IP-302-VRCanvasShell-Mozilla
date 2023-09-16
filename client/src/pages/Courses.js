import { useEffect, useState, useCallback } from "react";
import { getCourses } from "../storage/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { Row, Col } from "react-bootstrap"; // Import Row and Col from Bootstrap
import Course from "../components/Course";
import "../styles/pages.css"

function Courses(props) {
  const [courses, setCourses] = useState([]);
  const token = useSelector(state => state.token.value);
  const navigate = useNavigate();
  console.log(token);

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
      <div className="courses-heading">
        <h1 style={{ fontSize: '4rem' }}>My Courses</h1>
        <hr />
        <Row>
          {courses.map((course, index) => (
            <Col key={index} lg={4} md={6} sm={12} > {/* Use Bootstrap Col with size 4 for large screens */}
              <Course course={course} setCourseID={props.setCourseID} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Courses;