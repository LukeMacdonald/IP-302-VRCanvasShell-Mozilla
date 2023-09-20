import React, { useState, useEffect } from "react";
import { getModule } from "../database/api";
import Room from "./Room";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/styles/components.css";

function Module(props) {
  const { moduleName, moduleID } = props;
  const course = useSelector((state) => state.course.value);
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null); // State to store module data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // Fetch module data when the component mounts
    async function fetchModule() {
      try {
        const module = await getModule(course.id, moduleID);
        setModuleData(module);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        // Handle errors here
        console.error("Error fetching module:", error);
      }
    }

    fetchModule();
  }, [course.id, moduleID]);

  const handleSelect = () => {
    navigate(`${moduleID}/rooms/add`);
  };

  return (
    <div className="card module-card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h2 className="module-title">{moduleName}</h2>
          <Button
            variant="outline-danger"
            onClick={handleSelect}
            className="add-room-button"
          >
            <i className="fa fa-plus" />
          </Button>
        </div>
        <hr />
        {loading ? (
          <p>Loading module data...</p>
        ) : (
          <div className="row">
            {Object.keys(moduleData.rooms).map((room, index) => (
              <div key={index} className="col-lg-6">
                <Room moduleName={moduleID} roomName={room} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Module;



