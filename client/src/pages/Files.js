import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FileCard from '../components/FileCard';
import { getCoursefiles } from '../data/data';
import CreateRoom from './CreateRoom';

function Files(props) {
  const [files, setFiles] = useState(getCoursefiles());

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
          {files.map((file, index) => (
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

export default Files;
