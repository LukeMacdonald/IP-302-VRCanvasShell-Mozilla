// ModuleSection.js
import React from "react";
import { Row, Col } from "react-bootstrap";
import ModuleFiles from "../files/ModuleFiles";
import "../../styles/components.css"

function ModuleFilesSection({
  moduleID,
  moduleFiles,
  setSelectedFiles // Pass the setModuleFiles prop
}) {  
  return (
    <section className="selected-section">
      <Row>
        <Col>
          <h4 className="file-type-heading">Module Files</h4>
        </Col> 
      </Row>
      <hr />
      <ModuleFiles
        selectedFiles={moduleFiles} // Pass the selectedFiles prop
        modulename={moduleID}
        setSelectedFiles={setSelectedFiles} // Pass the setSelectedFiles prop
      />
    </section>
  );
}

export default ModuleFilesSection;