// ModuleSection.js
import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import ModuleFiles from "../files/SelectModuleFile";

const MAX_FILES_COUNT = 4;

function ModuleFilesSection({
    moduleID,
  moduleFiles,
  showModals,
  handleToggleModal,
  handleFileSelect,
  handleAddFile,
  isLoading,
}) {
  return (
    <section style={{ margin: '2rem' }}>
    <Row>
      <Col>
        <h4 style={{ textAlign: 'left' }}>Module Objects</h4>
      </Col>
      <Col style={{ textAlign: 'right' }}>
        <Button
          variant="outline-success"
          onClick={handleAddFile}
          style={{ width: "4rem" }}
          disabled={moduleFiles.length >= MAX_FILES_COUNT || isLoading}
        >
          +
        </Button>
      </Col>
    </Row>
    <hr />
  
    {moduleFiles.map((file, fileIndex) => (
      <div key={fileIndex} className="file-section" style={{ backgroundColor: '#e8e8e8', padding: '2px', borderRadius: '10px' ,margin:'1rem'}}>
        <Row style={{ margin: '1rem' }}>
          <Col md={8}>
            <p style={{ textAlign: "left" }}>
              <b>{file.display_name ? file.display_name : "Select File"}</b>
            </p>
          </Col>
          <Col md={4}>
            <Button
              variant="secondary"
              style={{ width: "50%" }}
              onClick={() => handleToggleModal(fileIndex, true)}
              disabled={isLoading}
            >
              {file.display_name ? `Edit` : `Select`}
            </Button>
          </Col>
        </Row>
        <ModuleFiles
          show={showModals[fileIndex]}
          modulename={moduleID}
          onHide={() => handleToggleModal(fileIndex, false)}
          onSelect={(selectedFile) => handleFileSelect(fileIndex, selectedFile, "module")}
        />
      </div>
    ))}
  </section>
  
  );
}

export default ModuleFilesSection;