import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { getCoursefiles } from "../../storage/storage";
import { useNavigate } from "react-router-dom";

const MAX_FILES_COUNT = 4;

function CourseFilesSection(props) {
  const [files, setFiles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch files using an async function
    const fetchFiles = async () => {
      try {
        const courseFiles = await getCoursefiles();
        setFiles(courseFiles);
      } catch (error) {
        console.error("Error fetching course files:", error);
        navigate("/error");
      }
    };

    // Call the async function to fetch files
    fetchFiles();
  }, [navigate]);

  const containsId = (files, targetId) => {
    return files.some((file) => file.id === targetId);
  };

  const handleCheckboxChange = (file) => {
    const isChecked = containsId(props.files, file.id);
    console.log("Before update:", props.files);
    if (isChecked) {
      // If the file is already in props.files, remove it
      props.updateFiles((prevFiles) =>
        prevFiles.filter((prevFile) => prevFile.id !== file.id)
      );
    } else if (props.files.length < MAX_FILES_COUNT) {
      // If the file is not in props.files and the count is less than the maximum, add it
      props.updateFiles((prevFiles) => [...prevFiles, file]);
    }
    console.log("After update:", props.files);
  };

  return (
    <div>      
        <section className="selected-section">
          <Row>
            <Col>
              <h4 className="file-type-heading">Additional Files</h4>
            </Col>
            <Col className="add-file-section">
              <Button
                variant="outline-danger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="add-file-button"
              >
               {isDropdownOpen ? (
                <i className="fa fa-minus" />
              ) : (
                <i className="fa fa-plus" />
              )}
              </Button>
            </Col>
          </Row>
          <hr />
      
          {isDropdownOpen && files.map((file, fileIndex) => (
            <div style={{ textAlign: "left" }} key={fileIndex}>
              <Form.Check
                label={file.display_name}
                onChange={() => handleCheckboxChange(file)}
                checked={containsId(props.files, file.id)}
              />
            </div>
          ))}
        </section>
      
    </div>
  );
}

export default CourseFilesSection;

