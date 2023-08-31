import React, { useState } from "react";
import { Button } from "react-bootstrap";
import FormInput from "../components/FormInput";
import Files from "./Files";
import { useNavigate, useLocation } from "react-router-dom";
import { addRoomtoModule } from "../data/data";

const MAX_FILES_COUNT = 4;

function CreateRoom() {
  const location = useLocation();
  const moduleName = location.state?.moduleName || "DefaultModuleName";
  const [isLoading, setIsLoading] = useState(false);

  const [fields, setFields] = useState({
    roomName: "",
    files: [],
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
    if (fields.files.length > 0) {
      setIsLoading(true);
      try {
        await addRoomtoModule(moduleName, fields.roomName, fields.files[0], fields.files);
        navigate("/home");
      } catch (error) {
        console.error("Error creating room:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileSelect = (fileIndex, selectedFile) => {
    setFields((prevFields) => ({
      ...prevFields,
      files: prevFields.files.map((file, index) =>
        index === fileIndex ? selectedFile : file
      ),
    }));
    handleToggleModal(fileIndex, false);
  };

  const handleToggleModal = (fileIndex, showModal) => {
    setShowModals((prevModals) =>
      prevModals.map((modal, index) => (index === fileIndex ? showModal : modal))
    );
  };

  const handleAddFile = () => {
    if (fields.files.length < MAX_FILES_COUNT) {
      setFields((prevFields) => ({
        ...prevFields,
        files: [...prevFields.files, { display_name: "" }],
      }));
      setShowModals((prevModals) => [...prevModals, false]);
    }
  };

  const isCreateButtonDisabled = fields.files.length === 0 || isLoading;

  return (
    <div className="create-room-container" style={{ width: "70%", margin: "2rem auto" }}>
      <form onSubmit={handleCreateRoom}>
        <h1>Create Room</h1>
        <div style={{ width: "50%" }}>
          <h4 style={{ textAlign: 'left' }}>Room Name</h4>
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
        <div className="files-container">
          <h4 style={{ textAlign: 'left' }}>Room Objects</h4>
          {fields.files.map((file, fileIndex) => (
            <div key={fileIndex} className="file-section">
              <div className="row" style={{ margin: '1rem' }}>
                <div className="col-md-8">
                  <p style={{ textAlign: "left" }}>
                    <b>Object {fileIndex + 1}:</b> {file.display_name}
                  </p>
                </div>
                <div className="col-md-4">
                  <Button
                    style={{ width: "60%" }}
                    onClick={() => handleToggleModal(fileIndex, true)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : `Select Object ${fileIndex + 1}`}
                  </Button>
                </div>
              </div>
              <Files
                show={showModals[fileIndex]}
                onHide={() => handleToggleModal(fileIndex, false)}
                onSelect={(selectedFile) => handleFileSelect(fileIndex, selectedFile)}
              />
            </div>
          ))}
          <Button
            variant="success"
            onClick={handleAddFile}
            disabled={fields.files.length >= MAX_FILES_COUNT}
          >
            +
          </Button>
        </div>
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
      </form>
    </div>
  );
}

export default CreateRoom;










