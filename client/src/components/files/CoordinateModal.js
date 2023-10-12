import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CoordinateModal(props) {
  const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });

  const handleSave = () => {
    // Validate and save coordinates logic goes here
    // For example, you can send the coordinates to the server/database
    // and update the UI accordingly.
    
    // Close the modal after saving coordinates
    props.onSave(coordinates);
    props.onHide();
  };

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enter Coordinates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>X Coordinate:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter X coordinate"
            value={coordinates.x}
            onChange={(e) => setCoordinates({ ...coordinates, x: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Y Coordinate:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Y coordinate"
            value={coordinates.y}
            onChange={(e) => setCoordinates({ ...coordinates, y: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Z Coordinate:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Z coordinate"
            value={coordinates.z}
            onChange={(e) => setCoordinates({ ...coordinates, z: e.target.value })}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CoordinateModal;
