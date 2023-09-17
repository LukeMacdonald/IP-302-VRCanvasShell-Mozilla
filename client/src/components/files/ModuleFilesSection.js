import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { getCanvasCourseModuleFiles } from "../../storage/storage";
import Form from "react-bootstrap/Form";

const MAX_FILES_COUNT = 4;

function ModuleFilesSection(props) {
  const [moduleFiles, setModuleFiles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const files = await getCanvasCourseModuleFiles(props.modulename);
        setModuleFiles(files);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [props.modulename]);

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
    <section className="selected-section">
      <Row>
        <Col>
          <h4 className="file-type-heading">Modules Files</h4>
        </Col>
        <Col className="add-file-section"></Col>
      </Row>
      <hr />

      {moduleFiles.map((file, fileIndex) => (
        <div style={{ textAlign: "left" }} key={fileIndex}>
          <Form.Check
            label={file.display_name}
            onChange={() => handleCheckboxChange(file)}
            checked={containsId(props.files, file.id)}
          />
        </div>
      ))}
    </section>
  );
}

export default ModuleFilesSection;
