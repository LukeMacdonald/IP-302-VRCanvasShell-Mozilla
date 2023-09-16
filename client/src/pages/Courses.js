import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setMyCourses } from '../storage/reducers'

import { Row, Col } from "react-bootstrap"; // Import Row and Col from Bootstrap
import Course from "../components/Course";
import "../styles/pages.css"
import useFetch from "../hooks/useFetch";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, data } = useFetch("course/teacher");

  useEffect(() => {
    if (status === "fetched") {
      dispatch(setMyCourses(data));
      setCourses(data);
    }
    else if(status === "error"){
      navigate("/error")
    }
  }, [status, data, dispatch, navigate]); // useEffect will run whenever status or data changes

  return (
    <>
      <div className="courses-heading">
        <h1 style={{ fontSize: '4rem' }}>My Courses</h1>
        <hr />
        <Row>
          {courses.map((course, index) => (
            <Col key={index} lg={4} md={6} sm={12} > {/* Use Bootstrap Col with size 4 for large screens */}
              <Course course={course}/>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default Courses;

