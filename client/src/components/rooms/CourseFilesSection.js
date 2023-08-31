import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import AllFiles from "../files/SelectCourseFile";
import "../../styles/components.css";

const MAX_FILES_COUNT = 4;

function CourseFilesSection({
  moduleID,
  additionalFiles,
  showModals,
  handleToggleModal,
  handleFileSelect,
  handleAddFile,
  isLoading,
}) {
  return (
    <section className="selected-section">
      <Row>
        <Col>
          <h4 className="file-type-heading">Additional Files</h4>
        </Col>
        <Col className="add-file-section">
          <Button
            variant="outline-danger"
            onClick={() => handleAddFile("additional")}
            className="add-file-button"
            disabled={additionalFiles.length >= MAX_FILES_COUNT || isLoading}
          >
            <i className="fa fa-plus" />
          </Button>
        </Col>
      </Row>
      <hr />

      {additionalFiles.map((file, fileIndex) => (
        <div key={fileIndex} >
          <Row className="file-name-row">
            <Col className="file-section" md={9}>
            <div className={"cardClassName"}>
              <div className="row">
                <div className="col">
                  <div className="card-body">
                    <p className="card-text file-card-text">{file.display_name}</p>
                    </div>
                    </div>
                    </div>
                    </div>
            
            </Col>
            <Col md={3}>
              <Button
                variant="secondary"
                className="select-file-button"
                disabled={isLoading}
                onClick={() => handleToggleModal(fileIndex, true)}
              >
                <i className="fa fa-pen-to-square" />
              </Button>
            </Col>
          </Row>
          <AllFiles
            show={showModals[fileIndex]}
            modulename={moduleID}
            onHide={() => handleToggleModal(fileIndex, false)}
            onSelect={(selectedFile) =>
              handleFileSelect(fileIndex, selectedFile, "additional")
            }
          />
        </div>
      ))}
    </section>
  );
}

export default CourseFilesSection;
