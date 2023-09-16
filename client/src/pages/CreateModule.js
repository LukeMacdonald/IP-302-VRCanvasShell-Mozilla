import { getCanvasCourseModules, getModules, createCourseModule} from "../storage/storage";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/components.css";

function CreateModule(props) {
  const { courseID } = useParams();
  const [canvasModules, setCanvasModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const modules = getModules(courseID);
        const canvasModulesData = await getCanvasCourseModules(modules);
        setCanvasModules(canvasModulesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [courseID]);

  const handleModuleClick = async (module) => {
    try {
      await createCourseModule(module.id, module.name);
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
      {/* Bootstrap Modal */}
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

