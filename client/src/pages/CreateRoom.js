import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addRoomtoModule } from "../data/data";
import FormInput from "../components/FormInput";
import ModuleFilesSection from "../components/rooms/ModuleFilesSection";
// import CourseFilesSection from "../components/rooms/creation/CourseFilesSection";

const MAX_FILES_COUNT = 4;

function CreateRoom() {
  const { courseID, moduleID } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [moduleFiles, setModuleFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);

  const [fields, setFields] = useState({
    roomName: "",
  });

  const [showModals, setShowModals] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    const allFiles = [...moduleFiles, ...additionalFiles];

    if (allFiles.length > 0) {
      setIsLoading(true);
      try {
        await addRoomtoModule(moduleID, fields.roomName, allFiles);
        navigate(`/courses/${courseID}`);
      } catch (error) {
        console.error("Error creating room:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileSelect = (fileIndex, selectedFile, section) => {
    if (section === "module") {
      setModuleFiles((prevModuleFiles) =>
        prevModuleFiles.map((file, index) =>
          index === fileIndex ? selectedFile : file
        )
      );
    } else if (section === "additional") {
      setAdditionalFiles((prevAdditionalFiles) =>
        prevAdditionalFiles.map((file, index) =>
          index === fileIndex ? selectedFile : file
        )
      );
    }

    handleToggleModal(fileIndex, false);
  };

  const handleToggleModal = (fileIndex, showModal) => {
    setShowModals((prevModals) =>
      prevModals.map((modal, index) => (index === fileIndex ? showModal : modal))
    );
  };

  const handleAddFile = (section) => {
    const files = section === "module" ? moduleFiles : additionalFiles;

    if (files.length < MAX_FILES_COUNT) {
      if (section === "module") {
        setModuleFiles([...moduleFiles, { display_name: "" }]);
      } else if (section === "additional") {
        setAdditionalFiles([...additionalFiles, { display_name: "" }]);
      }

      setShowModals((prevModals) => [...prevModals, false]);
    }
  };

  const isCreateButtonDisabled =
    (moduleFiles.length === 0 && additionalFiles.length === 0) || isLoading;

  return (
    <Container className="create-room-container" style={{ width: "70%", margin: "2rem auto" }}>
      <Form onSubmit={handleCreateRoom}>
        <h1>Create Room</h1>
        <Row style={{ width: "100%", margin: '1rem' }}>
          <Col>
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
          </Col>
        </Row>
        <ModuleFilesSection
          moduleID={moduleID}
          moduleFiles={moduleFiles}
          showModals={showModals}
          handleToggleModal={handleToggleModal}
          handleFileSelect={handleFileSelect}
          handleAddFile={() => handleAddFile("module")}
          isLoading={isLoading}
        />
        {/* <CourseFilesSection
          moduleID={moduleID}
          additionalFiles={additionalFiles}
          showModals={showModals}
          handleToggleModal={handleToggleModal}
          handleFileSelect={handleFileSelect}
          handleAddFile={() => handleAddFile("additional")}
          isLoading={isLoading}
        /> */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button
            type="submit"
            variant="primary"
            style={{ width: '50%' }}
            disabled={isCreateButtonDisabled}
          >
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CreateRoom;

