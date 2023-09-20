import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { getModuleFiles} from "../../database/api";

import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";

const MAX_FILES_COUNT = 4;

function ModuleFilesSection(props) {
  const [moduleFiles, setModuleFiles] = useState([]);
  const course = useSelector(state => state.course.value);

  useEffect(() => {
    async function fetchData() {
      try {
        const files = await getModuleFiles(course.id, props.modulename);
        setModuleFiles(files);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [course,props.modulename]);

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
      <Accordion activeKey="0"> {/* Set activeKey to a value that doesn't match any event keys */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Module Files</Accordion.Header>
          <Accordion.Collapse eventKey="0">
            <Accordion.Body>
              {moduleFiles.map((file, fileIndex) => (
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

export default ModuleFilesSection;
