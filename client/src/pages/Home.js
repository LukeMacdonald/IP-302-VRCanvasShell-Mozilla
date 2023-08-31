import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import { Button, Col, Row,Offcanvas  } from "react-bootstrap";
import Module from "../components/Module";
import CreateModule from "./CreateModule";
import "../styles/pages.css";
import {
  getCourseName,
  getModules,
  setCourse,
  setCourseFiles,
  getCourses
} from "../data/data";

function Home() {
  const { courseID } = useParams();
  const [modules, setModules] = useState({});
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [show, setShow] = useState(false);
  
  const [courses, setCourses] = useState([]);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await setCourse(courseID);
        const fetchedModules = getModules(courseID);
        await setCourseFiles(courseID);
        const name = await getCourseName();
        setCourseName(name);
        setModules(fetchedModules);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [courseID, navigate]);

  const handleAddModuleClick = (event) => {
    event.preventDefault();
    setShowCreateModuleModal(true);
  };

  return (
    <> 
      <div className="course-sidebar">
          <Button variant="outline-danger" style = {{width:'10rem'}}onClick={handleShow}>All Courses</Button>
        </div>
      <div className="home-main-area">
        <h1 className="course-title">{courseName}</h1>
        <hr />
        
        <div className="home-modules">
          <div className="row">
            <div className="col-md-6">
              <h2>Modules</h2>
            </div>
            <div className="col-md-6 add-module-section">
              <Button
                variant={"outline-danger"}
                className="add-module-button"
                onClick={handleAddModuleClick}
              >
                <i className="fa fa-plus" />
              </Button>
            </div>
          </div>
          <hr />
          <Row>
            {Object.entries(modules).map(([moduleId, module]) => (
              <Col key={moduleId} lg={6}>
                <Module moduleName={module.name} moduleID={moduleId} />
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
        {showCreateModuleModal && (
          <CreateModule
            showCreateModuleModal={showCreateModuleModal}
            setShowCreateModuleModal={setShowCreateModuleModal}
            updateModules={setModules}
          />
        )}
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton >
          <Offcanvas.Title className="course-sidebar-title">All Courses</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
        
        {courses.map((course, index) => (
          <Link to={`/courses/${course.id}`} className="course-card-link">
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

export default Home;