import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

function CoordinateModal(props) {
  const [coordinates, setCoordinates] = useState({ x: "", y: "", z: "" });
  const [scales, setScales] = useState({ x: "", y: "", z: "" });
  const [rotations, setRotations] = useState({ x: "", y: "", z: "" });

  const handleSave = () => {
    // Validate input values (check if they are valid numbers) before saving

    // Example validation: Check if the values are numeric before saving
    const isValid =
      !isNaN(coordinates.x) &&
      !isNaN(coordinates.y) &&
      !isNaN(coordinates.z) &&
      !isNaN(scales.x) &&
      !isNaN(scales.y) &&
      !isNaN(scales.z) &&
      !isNaN(rotations.x) &&
      !isNaN(rotations.y) &&
      !isNaN(rotations.z);

    if (isValid) {
      // Save the data
      props.onSave(coordinates, scales, rotations);
    } else {
      // Handle validation error (show an error message to the user)
      console.error("Invalid input values. Please enter valid numbers.");
    }

    // Close the modal after saving coordinates, scales, and rotations
    props.onHide();
  };

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enter Object Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formCoordinates">
          <Form.Label>Coordinates:</Form.Label>
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter X coordinate"
            value={coordinates.x}
            onChange={(e) => setCoordinates({ ...coordinates, x: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Y coordinate"
            value={coordinates.y}
            onChange={(e) => setCoordinates({ ...coordinates, y: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Z coordinate"
            value={coordinates.z}
            onChange={(e) => setCoordinates({ ...coordinates, z: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formScales">
          <Form.Label>Scaling:</Form.Label>
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter X scale"
            value={scales.x}
            onChange={(e) => setScales({ ...scales, x: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Y scale"
            value={scales.y}
            onChange={(e) => setScales({ ...scales, y: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Z scale"
            value={scales.z}
            onChange={(e) => setScales({ ...scales, z: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRotations">
          <Form.Label>Rotation:</Form.Label>
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter X rotation"
            value={rotations.x}
            onChange={(e) => setRotations({ ...rotations, x: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Y rotation"
            value={rotations.y}
            onChange={(e) => setRotations({ ...rotations, y: e.target.value })}
          />
          <Form.Control
            type="text"
            style={{margin:'0.5rem 0', width:'75%'}}
            placeholder="Enter Z rotation"
            value={rotations.z}
            onChange={(e) => setRotations({ ...rotations, z: e.target.value })}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={{width:'100%'}}>
        <div style={{textAlign:'center', margin:'0 auto'}}>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
       
      </Modal.Footer>
    </Modal>
  );
}

CoordinateModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  // Add more PropTypes as needed for other props used by the component
};

export default CoordinateModal;

