import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap"; // Import Modal from react-bootstrap
import { useNavigate, useParams } from "react-router-dom";
import { getCanvasCourseModules, getModules, createCourseModule } from "../data/data";
import '../styles/modules.css';

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
      // Perform the desired action here using the module data
      await createCourseModule(module.id, module.name);
      
      // Get the updated modules after creating a module
      const newModules = getModules(courseID);
      
      // Call the callback function to update modules in the Home component
      props.updateModules(newModules);
      
      // Close the modal when action is performed
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
      <Modal show={props.showCreateModuleModal} onHide={() => props.setShowCreateModuleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {canvasModules.map((module, index) => (
            <Button
              key={index}
              className="module-button"
              onClick={() => handleModuleClick(module)} // Show the modal on button click
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
