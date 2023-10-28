import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { getCourseFiles } from "../../database/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CoordinateModal from "./CoordinateModal";

const MAX_FILES_COUNT = 4;

function CourseFilesSection(props) {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const course = useSelector(state => state.course.value);

  useEffect(() => {
    // Fetch files using an async function
    const fetchFiles = async () => {
      try {
        const courseFiles = await getCourseFiles(course.id);
        setFiles(courseFiles);
      } catch (error) {
        console.error("Error fetching course files:", error);
        navigate("/error");
      }
    };

    // Call the async function to fetch files
    fetchFiles();
  }, [navigate, course]);

  const containsId = (files, targetId) => {
    return files.some((file) => file.id === targetId);
  };

  const handleCheckboxChange = (file) => {
    const isChecked = containsId(props.files, file.id);
    if (!isChecked && props.files.length < MAX_FILES_COUNT) {
      setSelectedFile(file);
      setShowModal(true);
    } else if (isChecked) {
      props.updateFiles((prevFiles) =>
        prevFiles.filter((prevFile) => prevFile.id !== file.id)
      );
    }
  };
  const handleModalSave = (coordinates, scales, rotations) => {
    if (coordinates) {
      const updatedFile = { ...selectedFile, coordinates, scales, rotations };
      props.updateFiles((prevFiles) => [...prevFiles, updatedFile]);
    }
    setShowModal(false);
    setSelectedFile(null);
  };


  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" >
          <Accordion.Header>Additional Course Files</Accordion.Header>
          <Accordion.Collapse eventKey="0" >
            <Accordion.Body>
              {files.map((file, fileIndex) => (
                <div style={{ textAlign: "left" }} key={fileIndex}>
                  <Form.Check
                    label={file.display_name}
                    onChange={() => handleCheckboxChange(file)}
                    checked={containsId(props.files, file.id)}
                  />
                </div>
              ))}
              {selectedFile && (
              <CoordinateModal
              show={showModal}
              onHide={() => setShowModal(false)}
              onSave={handleModalSave} // Pass the onSave prop to handle coordinates in CourseFilesSection
            />)}
            </Accordion.Body>
          </Accordion.Collapse>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default CourseFilesSection;


