// AllFilesSection.js
import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import AllFiles from "../files/SelectCourseFile";

const MAX_FILES_COUNT = 4;

function CourseFilesSection(props) {
  return (
    <section>
      <h4 style={{ textAlign: 'left' }}>Additional Objects</h4>
      {props.additionalFiles.map((file, fileIndex) => (
        <div key={fileIndex} className="file-section">
          <Row style={{ margin: '1rem' }}>
            <Col md={8}>
              <p style={{ textAlign: "left" }}>
                <b>Object {fileIndex + 1}:</b> {file.display_name}
              </p>
            </Col>
            <Col md={4}>
              <Button
                style={{ width: "60%" }}
                onClick={() => props.handleToggleModal(fileIndex, true)}
                disabled={props.isLoading}
              >
                {props.isLoading ? "Loading..." : `Select`}
              </Button>
            </Col>
          </Row>
          <AllFiles
            show={props.showModals[fileIndex]}
            modulename={props.moduleID}
            onHide={() => props.handleToggleModal(fileIndex, false)}
            onSelect={(selectedFile) => props.handleFileSelect(fileIndex, selectedFile, "additional")}
          />
        </div>
      ))}
      <Button
        variant="success"
        onClick={props.handleAddFile}
        disabled={props.additionalFiles.length >= MAX_FILES_COUNT || props.isLoading}
      >
        +
      </Button>
    </section>
  );
}

export default CourseFilesSection;
