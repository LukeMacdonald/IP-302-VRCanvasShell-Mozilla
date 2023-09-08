import React, { useEffect, useState } from "react";
import { Button} from "react-bootstrap";
import { getModules, setCourse, setCourseFiles } from "../data/data";
import Module from "../components/Module";
import { useNavigate, useParams } from "react-router-dom";
import CreateModule from "./CreateModule";

function Home(props) {
  const { courseID } = useParams();
  const [modules, setModules] = useState({});
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        await setCourse(courseID);
        const fetchedModules = getModules(courseID);
        await setCourseFiles(courseID);
        setModules(fetchedModules);
      } catch (error) {
        navigate("/error");
        console.error("Error fetching data:", error);
        // Handle the error as needed, e.g., show an error message.
      }
    }
    fetchData();
  }, [courseID, navigate]);

  const handleModules = (event) => {
    event.preventDefault();
    setShowCreateModuleModal(true); // Show the modal when the button is clicked
  };

  return (
    <>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <h1
          style={{
            marginTop: "2rem",
            fontWeight: "bold",
            fontSize: "3.5rem",
          }}
        >
          Course Name
        </h1>
        <hr />
      </div>

      <div
        style={{
          textAlign: "left",
          margin: "4rem auto",
          width: "70%",
        }}
      >
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
            <Module moduleName={module.name} moduleID={moduleId} />
          </div>
        ))}
        <h2>Quizzes</h2>
        <hr />
        <h2>Assignments</h2>
        <hr />
      </div> 
      {showCreateModuleModal && (
        <CreateModule
          showCreateModuleModal={showCreateModuleModal}
          setShowCreateModuleModal={setShowCreateModuleModal}
          updateModules={setModules}
        />
      )}
    </>
  );
}

export default Home;
