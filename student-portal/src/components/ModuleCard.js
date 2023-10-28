import React, { useState, useEffect } from "react";
import { getModule } from "../database/api";
import RoomCard from "./Room";
import { useSelector } from "react-redux";
import "../assets/styles/components.css";

function ModuleCard(props) {
  const { moduleName, moduleID } = props;
  const course = useSelector((state) => state.course.value);
  const [moduleData, setModuleData] = useState(null); // State to store module data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    // Fetch module data when the component mounts
    async function fetchModule() {
      try {
        const module = await getModule(course.id, moduleID);
        setModuleData(module.rooms);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        // Handle errors here
        console.error("Error fetching module:", error);
      }
    }

    fetchModule();
  }, [course.id, moduleID]);

 

  return (
    <div className="card module-card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h2 className="module-title">{moduleName}</h2>
        </div>
        <hr />
        {loading ? (
          <p>Loading module data...</p>
        ) : (
          <div className="row">
            {moduleData.map((room, index) => (
              <div key={index} className="col-lg-6">
                <RoomCard moduleName={room.module_id} roomName={room.name} roomID={room.room_id}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleCard;



