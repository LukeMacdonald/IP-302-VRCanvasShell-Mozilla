import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Button } from "react-bootstrap";
import { getModules, setCourse } from "../data/data"; // Import your modules/functions
import ModuleCard from "../components/ModuleCard"; // Import your ModuleCard component
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Home(props) {
  // Access the courseId from the URL parameters
  const { courseID } = useParams();
  const navigate = useNavigate();

  // Use state to store the modules
  const [modules, setModules] = useState({});

  // Use useEffect to call setCourse and fetch modules when the component mounts or courseID changes
  useEffect(() => {
    async function fetchData() {
      await setCourse(courseID);
      const fetchedModules = getModules(courseID);
      setModules(fetchedModules);
    }
    fetchData();
  }, [courseID]); // Add courseId as a dependency

  const handleModules = (event) => {
    event.preventDefault();
    navigate(`modules/add`);
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
        <div key={moduleId} style={{ margin: "2rem" }}>
          <ModuleCard moduleName={module.name} moduleID={moduleId} />
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
