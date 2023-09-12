import ModuleFilesSection from "../components/rooms/ModuleFilesSection";
import CourseFilesSection from "../components/rooms/CourseFilesSection";
import { Button, Col, Container, Form, Row} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addRoomtoModule } from "../data/data";
import FormInput from "../components/FormInput";
import React, { useState} from "react";

import '../styles/pages.css'

const MAX_FILES_COUNT = 4;

function CreateRoom() {
  const { courseID, moduleID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [moduleFiles, setModuleFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [fields, setFields] = useState({ roomName: "" });
  const [showModals, setShowModals] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const updateFiles = (section, fileIndex, selectedFile) => {
    const setter = section === "module" ? setModuleFiles : setAdditionalFiles;
    setter((prevFiles) =>
      prevFiles.map((file, index) => (index === fileIndex ? selectedFile : file))
    );
  };

  const handleFileSelect = (fileIndex, selectedFile, section) => {
    updateFiles(section, fileIndex, selectedFile);
    handleToggleModal(fileIndex, false);
  };

  const handleToggleModal = (fileIndex, showModal) => {
    setShowModals((prevModals) =>
      prevModals.map((modal, index) => (index === fileIndex ? showModal : modal))
    );
  };
  const handleAddFile = (section) => {
    const newFile = { display_name: "" };
    let updatedFiles;
    let setter;

    if (section === "module") {
      updatedFiles = [...moduleFiles, newFile];
      setter = setModuleFiles;
    } else if (section === "additional") {
      updatedFiles = [...additionalFiles, newFile];
      setter = setAdditionalFiles;
    }

    if (updatedFiles.length <= MAX_FILES_COUNT) {
      setter(updatedFiles);
      setShowModals((prevModals) => [...prevModals, false]);
    }
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    const allFiles = [...moduleFiles, ...additionalFiles];

    if (allFiles.length > 0) {
      setIsLoading(true);
      try {
        await addRoomtoModule(moduleID, fields.roomName, allFiles);
        navigate(`/courses/${courseID}`);
      } catch (error) {
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isCreateButtonDisabled =
    moduleFiles.length + additionalFiles.length < 1 || // No files
    fields.roomName.trim() === "" || // Empty roomName
    moduleFiles.length + additionalFiles.length > MAX_FILES_COUNT;
 

  return (
    <>
    <Container className="create-room-container">
      
      <h1>Create Room</h1>
      <Form onSubmit={handleCreateRoom}>
        <div className="room-name-input">
            <FormInput
              label="roomName"
              name="roomName"
              id="roomName"
              type="text"
              value={fields.roomName}
              onChange={handleInputChange}
              placeholder="Enter Room Name"
              required={true}
            />
        </div>
        <Row>

        
        <Col lg={6}>
          <ModuleFilesSection moduleID={moduleID} moduleFiles={moduleFiles} setSelectedFiles={setModuleFiles} />
        </Col>
        <Col lg={6}>
        <CourseFilesSection
          moduleID={moduleID}
          additionalFiles={additionalFiles}
          showModals={showModals}
          handleToggleModal={handleToggleModal}
          handleFileSelect={handleFileSelect}
          handleAddFile={() => handleAddFile("additional")}
          isLoading={isLoading}
        />
          
        </Col>
        </Row> 
        <div className="text-center mt-2">
          <Button type="submit" variant="danger" style={{ width: "50%" }} disabled={isCreateButtonDisabled}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </Form>
    </Container>
    </>
  );
}

export default CreateRoom;
