import Navbar from "../components/Navbar";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { editRoom } from "../database/api";
import FormInput from "../components/FormInput";
import React, { useState } from "react";
import ModuleFilesSection from "../components/files/ModuleFilesSection";
import CourseFilesSection from "../components/files/CourseFilesSection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux";
import "../assets/styles/pages.css"

function EditRoom() {
  const { courseID, moduleID, roomID } = useParams();
  const location = useLocation();
  const { roomName } = location.state;
  console.log(roomName)

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]); // Manage all files using a single state
  const course = useSelector(state => state.course.value);

  const navigate = useNavigate();
  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (files.length > 0) {
      setIsLoading(true);
      try {
        await editRoom(course.id, moduleID, roomName, roomID, files);
        navigate(`/courses/${courseID}`);
      } catch (error) {
        console.log(error.message)
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isCreateButtonDisabled = files.length < 1 || files.length > 4;

  return (
    <>
      <Navbar/>
      <Form>
      <Row style={{ height: "91vh", maxWidth:'100%'}}>
        <Col md={4} className="create-room-left-col">
          <Container style={{ margin:'1rem 0 0 1rem'}}>
          <Button
            variant="danger"
            onClick={() => navigate(`/courses/${courseID}`)}
            className='back-button'
            >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button> 
            <h1>Edit Room:</h1>
            <h6 className='create-room-title'>Fill in Details about Room:</h6>
            <hr/>
            <Container className="room-details-container">
              <h5>Room Name:</h5>
              <FormInput
                label="roomName"
                name="roomName"
                id="roomName"
                type="text"
                value={roomName}
                disabled
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
              {isLoading ? "Updating..." : "Update Room"}
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

export default EditRoom;