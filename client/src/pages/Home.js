import React, { useEffect } from "react"; // Import useEffect
import { Button } from "react-bootstrap";
import { getModules, setCourse } from "../data/data"; // Import your modules/functions
import ModuleCard from "../components/ModuleCard"; // Import your ModuleCard component
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home(props) {
  // Access the courseId from the URL parameters
  const { courseID } = useParams();
  const navigate = useNavigate();

  // Use useEffect to call setCourse once when the component mounts
  useEffect(() => {
    async function fetchCourse() {
      await setCourse(courseID);
    }
    fetchCourse();
  }, [courseID]); // Add courseId as a dependency

  const modules = getModules(courseID);

  const handleModules = (event) => {
    event.preventDefault();
    navigate(`courses/${courseID}/modules/add`);
  };

  return (
    <div style={{ textAlign: "left", margin: "4rem auto", width: "70%" }}>
      <div className="row">
        <div className="col-md-6">
          <h2>Modules</h2>
        </div>
        <div
          className="col-md-6"
          style={{ textAlign: "right", paddingRight: "3rem" }}
        >
          <Button
            variant={"outline-danger"}
            style={{
              borderRadius: "10px",
              fontSize: "1rem",
              height: "3rem",
              width: "9rem",
            }}
            onClick={handleModules}
          >
            Add Module
          </Button>
          <br />
        </div>
      </div>
      <hr />
      {Object.entries(modules).map(([moduleId, module]) => (
        <div key={moduleId} style={{ marginLeft: "2rem" }}>
          <ModuleCard moduleName={module.name} moduleID={moduleId} /> {/* Added a space after module.name */}
        </div>
      ))}
      <h2>Quizzes</h2>
      <hr />
      <h2>Assignments</h2>
      <hr />
    </div>
  );
}

export default Home;