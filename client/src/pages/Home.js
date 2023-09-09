import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Navbar } from "react-bootstrap";
import Module from "../components/Module";
import CreateModule from "./CreateModule";
import Logo from "../styles/canvas.webp";
import "../styles/pages.css";
import {
  getCourseName,
  getModules,
  setCourse,
  setCourseFiles,
} from "../data/data";

function Home() {
  const { courseID } = useParams();
  const [modules, setModules] = useState({});
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");

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
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand className="navbar-brand" href="/">
          <img src={Logo} className="navbar-logo" alt="canvas" />
        </Navbar.Brand>
      </Navbar>
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
                Add Module
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
    </>
  );
}

export default Home;