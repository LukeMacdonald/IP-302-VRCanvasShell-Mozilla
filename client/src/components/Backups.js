import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBackups, restoreBackup } from "../api/endpoints";
import { Button, Modal } from "react-bootstrap";
import "../assets/styles/components.css";

export default function RestoreBackup(props) {
  const courseID = props.courseID;
  const [backups, setBackups] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const canvasBackups = await getBackups(courseID);
        setBackups(canvasBackups.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [courseID, props.showModal]);

  const handleModuleClick = async (backup) => {
    try {
      await restoreBackup({ courseID: courseID, backup: backup });
      props.setShowModal(false);
      window.location.reload();
    } catch (error) {
      navigate("/error");
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="module-container">
      <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Backup Version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {backups.map((backup, index) => (
            <Button
              key={index}
              className="module-button"
              onClick={() => handleModuleClick(backup)}
            >
              {backup.display_name}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
}
