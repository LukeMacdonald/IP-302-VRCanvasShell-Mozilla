import React, { useEffect, useState} from "react";
import { getModules} from "../database/api";
import { useNavigate, Link } from "react-router-dom";
import { Button, Col, Row,Offcanvas  } from "react-bootstrap";
import ModuleCard from "../components/ModuleCard";
import "../assets/styles/pages.css";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

function CourseDashboard() {

  const course = useSelector(state => state.course.value);

  const courses = useSelector(state => state.courses.value);
 
  const [modules, setModules] = useState({});

  const navigate = useNavigate();
 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedModules = await getModules(course.id);
        setModules(fetchedModules);
      } catch (error) {
        // navigate("/error");
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [course, navigate,courses]);

  return (
    <> 
      <Navbar/>
      <div className="course-sidebar">
          <Button variant="outline-danger" style = {{width:'10rem'}}onClick={handleShow}>All Courses</Button>
        </div>
      <div className="home-main-area">
        <h1 className="course-title">{course.name}</h1>
        <hr />
        
        <div className="home-modules">
          <div className="row">
            <div className="col-md-6">
              <h2>Modules</h2>
            </div> 
          </div>
          <hr />
          <Row>
            {Object.entries(modules).map(([moduleId, module]) => (
              <Col key={moduleId} lg={6}>
                <ModuleCard moduleName={module.name} moduleID={module.module_id} />
              </Col>
            ))}
          </Row>
          {Object.keys(modules).length > 0 && (
            <>
              <h2>Quizzes</h2>
              <hr />
              <h2>Assignments</h2>
              <hr />
            </>
          )}
        </div>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton >
          <Offcanvas.Title className="course-sidebar-title">All Courses</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
        
        {courses.map((course, index) => (
          <Link key = {index} to={`/courses/${course.id}`} className="course-card-link">
          <div className="course-sidebar-item">
            <h5>{course.name}</h5>
          </div>
        </Link>
       
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CourseDashboard;
