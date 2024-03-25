import React, { useState, useEffect } from "react";
import { deleteRoom, getRoom, loadRoom, updateRoom } from "../database/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLoadingState from "../hooks/useLoadingState";

function RoomCard(props) {
  const { moduleName, roomName, roomID } = props;
  const course = useSelector((state) => state.course.value);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const { isLoading, startLoading, stopLoading } = useLoadingState(); // State to track loading

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        startLoading();
        document.body.style.cursor = "wait";
        const roomData = await getRoom(course.id, moduleName, roomID);
        setRoom(roomData);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching room:", error);
      } finally {
        stopLoading();
        document.body.style.cursor = "default";
      }
    };

    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoomLoad = async () => {
    if (!room) {
      return;
    }

    try {
      startLoading();
      document.body.style.cursor = "wait";
      await loadRoom(moduleName, roomID, course.id);
    } catch (error) {
      // Handle errors here, e.g., redirect to an error page
      console.error("Error loading room:", error);
      navigate("/error");
    } finally {
      stopLoading();
      document.body.style.cursor = "default";
    }
  };
  const handleUpdateRoom = async (event) => {
    event.preventDefault();
    await updateRoom(roomID);
    window.alert("Room updated!");
  };

  const handleDeleteRoom = async () => {
    await deleteRoom(roomID);
    window.location.reload();
  };

  return (
    <div className="flex sm:flex-col items-center justify-between m-2 p-2 border border-solid border-dark rounded-md shadow-sm">
      <h5 className="font-semibold text-lg">{roomName}</h5>
      <div className="flex sm:flex-col md:gap-2">
        <button
          className="px-3 mx-1 py-2 bg-sky-950 hover:bg-sky-700 text-light rounded-md disabled:bg-sky-200 disabled:hover:bg-sky-200"
          onClick={handleRoomLoad}
          disabled={isLoading}
        >
          Visit
        </button>
        <button
          className="px-3 mx-1 py-2 bg-orange-700 hover:bg-orange-500 text-light rounded-md disabled:bg-red-300 disabled:hover:bg-red-300"
          onClick={handleUpdateRoom}
          disabled={isLoading}
        >
          Update
        </button>
        <button
          className="px-3 mx-1 py-2 bg-red-700 hover:bg-red-500 text-light rounded-md disabled:bg-red-300 disabled:hover:bg-red-300"
          onClick={handleDeleteRoom}
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
