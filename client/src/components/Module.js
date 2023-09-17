import React from "react";
import { getModule } from "../storage/storage";
import Room from "./Room";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/components.css"

function Module(props) {
  const { moduleName, moduleID } = props;
  const navigate = useNavigate();
  const module = getModule(moduleID);
  const rooms = Object.keys(module.rooms);

  const handleSelect = () => {
    navigate(`${moduleID}/rooms/add`);
  };

  return (
    <div className="card module-card">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h2 className="module-title">{moduleName}</h2>
          <Button
            variant="outline-danger"
            onClick={handleSelect}
            className="add-room-button"
          >
            <i className="fa fa-plus" />
          </Button>
        </div>
        <hr />
        <div className="row">
          {rooms.map((room, index) => (
            <div key={index} className="col-lg-6">
              <Room moduleName={moduleID} roomName={room} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Module;


