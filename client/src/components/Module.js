import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getModule, getUnusedModules, postModule, getModules, deleteModule } from "../database/api";
import { useSelector } from "react-redux";
import {motion} from "framer-motion"
import useLoadingState from "../hooks/useLoadingState";
import RoomCard from "./Room";
import { Button, Modal } from "react-bootstrap";
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
  }, [course, canvasModules]);

  const handleModuleClick = async (module) => {
    try {
      await postModule({courseID: course.id, moduleID: module.id, moduleName: module.name, courseName:course.name});
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

function Module(props) {
  
  const { moduleName, moduleID } = props;
  
  const course = useSelector((state) => state.course.value);
  
  const navigate = useNavigate();
  
  const [moduleData, setModuleData] = useState([]); // State to store module data
  
  const { isLoading, startLoading, stopLoading } = useLoadingState(); // State to track loading

  useEffect(() => {
    // Fetch module data when the component mounts
    async function fetchModule() {
      try {
        startLoading()
        const module = await getModule(course.id, moduleID);
        setModuleData(module.rooms);
        stopLoading(); // Set loading to false when data is available
      } catch (error) {
        // Handle errors here
        console.error("Error fetching module:", error);
      }
    }

    fetchModule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = () => {
    navigate(`${moduleID}/rooms/add`);
  };
  const handleDelete = async () => {
    await deleteModule(moduleID);
    window.location.reload();
  }

  return (
    <div className="w-full border border-solid flex flex-col items-center justify-start p-2 rounded-md">
      <div className="w-full flex items-center justify-between mb-3">
       <h2 className="self-start ml-2 text-2xl font-bold sm:text-xl">{moduleName}</h2>
       <div className="">
       <motion.button 
       className="py-2 px-2 bg-slate-900 hover:bg-slate-500 text-light rounded-lg text-sm"
        onClick={handleSelect}
        whileHover={{scale:1.1}}
      >New Room</motion.button>
             <motion.button 
        className="py-2 px-2 mx-2 bg-slate-500 hover:bg-slate-500 text-light rounded-lg text-sm"
        onClick={handleDelete}
        whileHover={{scale:1.1}}
      >Delete Module</motion.button>

       </div>


      </div>
      
      {isLoading ? (
          <p>Loading module data...</p>
        ) : (
          <div className="w-full">
            {moduleData.map((room, index) => (
                <RoomCard key={index} moduleName={room.module_id} roomName={room.name} roomID={room.room_id}/>
            ))}
          </div>
        )}
      

    </div>
  );
}

export {Module, CreateModule};



