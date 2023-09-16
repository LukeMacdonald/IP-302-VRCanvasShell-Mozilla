import React, { useState, useEffect } from 'react';
import FileCard from './FileCard';
import { getCanvasCourseModuleFiles } from '../../storage/storage';
import { Col, Row } from 'react-bootstrap';

function ModuleFiles(props) {
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

  const handleFileSelect = (file) => {
    const isSelected = (props.selectedFiles || []).some((selectedFile) => selectedFile.id === file.id);

    if (isSelected) {
      // Remove the file from selectedFiles if it's already selected
      const updatedFiles = (props.selectedFiles || []).filter((selectedFile) => selectedFile.id !== file.id);
      props.setSelectedFiles(updatedFiles);
    } else {
      // Add the file to selectedFiles if it's not already selected
      props.setSelectedFiles([...(props.selectedFiles || []), file]);
    }
  };

  return (
    <Row style={{ margin: '0 auto', textAlign: 'center' }}>
      {moduleFiles.map((file, index) => (
        <Col key={index} lg={12}>
          <FileCard
            file={file}
            onSelect={(fileUrl) => handleFileSelect(fileUrl)}
            isSelected={(props.selectedFiles || []).some((selectedFile) => selectedFile.id === file.id)}
            setSelectedFiles={props.setSelectedFiles} // Pass the setSelectedFiles prop to FileCard
          />
        </Col>
      ))}
    </Row>
  );
}

export default ModuleFiles;



