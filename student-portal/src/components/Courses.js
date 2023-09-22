import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMyCourses } from "../redux/reducers";
import { Row, Col, Container } from "react-bootstrap";
import CourseCard from "./CourseCard";
import "../assets/styles/pages.css";
import { getCourses } from "../database/api";

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
      navigate("/error");
      console.error("Error fetching courses:", error);
    }
  }, [navigate, dispatch]);
  useEffect(() => {
    // Make sequential requests
    async function fetchData() {
      await fetchCourses();
    }
    fetchData();
  }, [fetchCourses]);
  return (
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
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </Col>
  );
}
export default Courses;