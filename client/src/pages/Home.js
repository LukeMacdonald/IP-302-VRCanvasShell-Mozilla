import React from "react";
import { Button } from "react-bootstrap";
import { getModules } from "../data/data";
import ModuleCard from "../components/ModuleCard";
import { useParams } from "react-router-dom";

function Home(props) {
  // Access the courseId from the URL parameters
  const { courseId } = useParams();
  const modules = getModules(courseId);

  return (
    <div style={{ textAlign: 'left', margin: '4rem auto', width: '70%' }}>
      <div className="row">
        <div className="col-md-6">
          <h2>Modules</h2>
        </div>
        <div className="col-md-6" style={{ textAlign: 'right', paddingRight: '3rem' }}>
          <Button variant={'outline-danger'} style={{ borderRadius: '10px', fontSize: '1rem', height: '3rem', width: '9rem' }}>Add Module</Button><br />
        </div>
      </div>
      <hr />
      {Object.keys(modules).map((moduleName) => (
        <div key={moduleName} style={{ marginLeft: '2rem' }}>
          <ModuleCard moduleName={moduleName} />
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