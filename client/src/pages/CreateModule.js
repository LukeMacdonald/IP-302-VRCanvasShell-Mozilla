import { getUnusedModules, postModule, getModules } from "../database/api";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/styles/components.css";

function CreateModule(props) {
  const { courseID } = useParams();
  const [canvasModules, setCanvasModules] = useState([]);
  const course = useSelector(state => state.course.value);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const canvasModulesData = await getUnusedModules(course.id);
        setCanvasModules(canvasModulesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [course]);

  const handleModuleClick = async (module) => {
    try {
      await postModule({courseID: course.id, moduleID: module.id, moduleName: module.name});
      const newModules = getModules(courseID);
      props.updateModules(newModules);
      props.setShowCreateModuleModal(false);
    } catch (error) {
      navigate("/error");
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="module-container">
      <h1>Available Modules</h1>
      <hr />
      <Modal
        show={props.showCreateModuleModal}
        onHide={() => props.setShowCreateModuleModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {canvasModules.map((module, index) => (
            <Button
              key={index}
              className="module-button"
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default CreateModule;