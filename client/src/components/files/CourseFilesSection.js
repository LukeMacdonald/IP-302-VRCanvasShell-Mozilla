import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { getCoursefiles } from "../../storage/storage";
import { useNavigate } from "react-router-dom";

const MAX_FILES_COUNT = 4;

function CourseFilesSection(props) {
  const [files, setFiles] = useState([]);
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
    if (isChecked) {
      // If the file is already in props.files, remove it
      props.updateFiles((prevFiles) =>
        prevFiles.filter((prevFile) => prevFile.id !== file.id)
      );
    } else if (props.files.length < MAX_FILES_COUNT) {
      // If the file is not in props.files and the count is less than the maximum, add it
      props.updateFiles((prevFiles) => [...prevFiles, file]);
    }
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
            </Accordion.Body>
          </Accordion.Collapse>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default CourseFilesSection;


