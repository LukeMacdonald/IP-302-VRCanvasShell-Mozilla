import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FileCard from './FileCard';
import { getCanvasCourseModuleFiles } from '../../data/data';

function SelectModuleFile(props) {
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
  }, [props.modulename]); // Use props.moduleName as a dependency

  const handleFileSelect = (file) => {
    props.onSelect(file);
    props.onHide();
  };

  return (
    <div style={{ margin: '0 auto', textAlign: 'center', width: '25%' }}>
      <Modal {...props} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Select a File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {moduleFiles.map((file, index) => (
            <FileCard
              file={file}
              key={index}
              onSelect={(fileUrl) => handleFileSelect(fileUrl)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SelectModuleFile;