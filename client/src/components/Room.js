import React, { useState, useEffect } from "react";
import { getRoom, loadRoom } from "../database/api";
import { Button, Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/styles/components.css";

function RoomCard(props) {
  const { moduleName, roomName, roomID } = props;
  const course = useSelector((state) => state.course.value);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    async function fetchRoom() {
      try { 
        const roomData = await getRoom(course.id, moduleName, roomID);
        setRoom(roomData);
        setLoading(false); // Set loading to false when data is available
      } catch (error) {
        // Handle errors here
        console.error("Error fetching room:", error);
      }
    }

    fetchRoom();
  }, [course.id, moduleName, roomID]);

  const handleRoomLoad = async () => {
    if (!room) {
      // Handle the case where room data is not available yet
      return;
    }

    try {
      await loadRoom(moduleName, roomID, course.id);
    } catch (error) {
      // Handle errors here, e.g., redirect to an error page
      console.error("Error loading room:", error);
      navigate('/error');
    }
  };

  const handleEditRoom = async () => {
    navigate(`${moduleName}/rooms/edit/${roomID}`, { state: { roomName } });
  };

  return (
    <div className="card room-card">
      <div className="row">
        <div className="col">
          <div className="card-body room-card-text">
            <h5 className="room-card-text">{roomName}</h5>
            {loading ? (
              // Display a spinner while loading
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : (
              // Display the buttons when not loading
              <div className="button-group">
                <Button
                  variant="danger"
                  className="load-room-button"
                  onClick={handleRoomLoad}
                >
                  Load Room
                </Button>
                <Button
                  variant="danger"
                  className="load-room-button"
                  onClick={handleEditRoom}
                >
                  Edit Room
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
