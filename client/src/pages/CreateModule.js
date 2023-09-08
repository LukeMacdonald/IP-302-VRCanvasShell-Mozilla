import { useNavigate, useParams } from "react-router-dom";
import { getCanvasCourseModules, getModules, createCourseModule } from "../data/data";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import '../styles/modules.css'

function CreateModule() {
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

  // Define a function to handle the button click
  const handleModuleClick = async (module) => {
    // Perform the desired action here using the module data 
    await createCourseModule(module.id,module.name);
    navigate(`/courses/${courseID}`)
    // You can perform any action you want here
  };

  return (
    <div className="module-container">
      <h1>Available Modules</h1>
      {canvasModules.map((module, index) => (
        <Button
          key={index}
          className="module-button"
          onClick={() => handleModuleClick(module)}
        >
          {module.name}
        </Button>
      ))}
    </div>
  );
}

export default CreateModule;