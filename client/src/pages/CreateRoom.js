import Navbar from "../components/Navbar";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addRoomtoModule } from "../storage/storage";
import FormInput from "../components/FormInput";
import React, { useState } from "react";
import ModuleFilesSection from "../components/files/ModuleFilesSection";
import CourseFilesSection from "../components/files/CourseFilesSection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons'

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

  const isCreateButtonDisabled = files.length < 1 || files.length > 4 || fields.roomName.trim() === "";

  return (
    <>
      <Navbar/>
      <Form>
      <Row style={{ height: '91vh' }}>
        <Col md={4} style={{ textAlign: 'left', backgroundColor: '#EAEAEA', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Container style={{ margin:'1rem 0 0 1rem'}}>
          <Button
            variant="danger"
            onClick={() => navigate(`/courses/${courseID}`)}
            style={{
              marginBottom: '2rem',
              width: '150px',
              borderRadius: '25px',
              display: 'flex',
              justifyContent: 'center', // Center the content horizontally
              alignItems: 'center', // Center the content vertically
              gap: '1.5rem', // Add spacing between the icon and text
          }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button>
        
            <h1>New Room:</h1>
            <h6 style={{marginLeft:'0.5rem'}}>Fill in Details about Room:</h6>
            <hr/>
            <Container style={{ width: '100%', textAlign:'left' }}>
              <h5>Room Name:</h5>
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
            </Container>
          </Container>
          <Container className="text-center" style={{marginBottom:'2rem'}}>
            <Button
              type="submit"
              variant="danger"
              style={{ width: "75%" }}
              disabled={isCreateButtonDisabled}
              onClick={handleCreateRoom}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </Container>
        </Col>
        <Col md={8}>
          <Container style={{textAlign: 'left',margin:'7rem 0 0 0' }}>
            <h3>Room Objects</h3>
            <p>Select objects to be uploaded into room:</p>
            <Row>
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
          </Container>
        </Col>
      </Row>
      </Form>
    </>
  );
}

export default CreateRoom;