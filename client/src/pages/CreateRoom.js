import { Button, Container, Form,Row,Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addRoomtoModule } from "../storage/storage";
import FormInput from "../components/FormInput";
import React, { useState } from "react";
import ModuleFilesSection from "../components/files/ModuleFilesSection";
import CourseFilesSection from "../components/files/CourseFilesSection";
import '../styles/pages.css'


function CreateRoom() {
  const { courseID, moduleID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState({ roomName: "" });
  const [files, setFiles] = useState([]); // Manage all files using a single state
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
    if (files.length > 0) {
      setIsLoading(true);
      try {
        await addRoomtoModule(moduleID, fields.roomName, files);
        navigate(`/courses/${courseID}`);
      } catch (error) {
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isCreateButtonDisabled = files.length < 1 || files.length > 4 || fields.roomName.trim() === "" ;

  return (
    <Container className="create-room-container">
      <h1>Create Room</h1>
      
      <Form onSubmit={handleCreateRoom}>
        <div className="room-name-input">
          <div style={{textAlign:"left"}}>
            <h4 style={{fontWeight:'bolder'}}>Room Name:</h4>
          </div>
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
       <div className="room-name-input" style={{textAlign:'left'}}>
        <h4 style={{fontWeight:'bolder'}}>Room Content:</h4>
       
        <Row style={{}}>
          <Col md={6}>
            <ModuleFilesSection
              files={files}
              updateFiles={setFiles} // Pass setFiles to update files state
              modulename={moduleID}
            />
          </Col>
          <Col md={6}>
            <CourseFilesSection
              files={files}
              updateFiles={setFiles} // Pass setFiles to update files state
            />
          </Col>
        </Row>
        </div>
        <div className="text-center mt-2">
          <Button
            type="submit"
            variant="danger"
            style={{ width: "50%" }}
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
