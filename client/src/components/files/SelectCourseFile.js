import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FileCard from './FileCard';
import { getCoursefiles } from '../../data/data';
import { useNavigate } from 'react-router-dom';

function SelectCourseFile(props) {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch files using an async function
    const fetchFiles = async () => {
      try {
        const courseFiles = await getCoursefiles();
        setFiles(courseFiles);
      } catch (error) {
        console.error('Error fetching course files:', error);
        navigate("/error")
      }
    };

    // Call the async function to fetch files
    fetchFiles();
  }, [navigate]); // The empty dependency array ensures this effect runs only once on component mount

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

export default SelectCourseFile;
