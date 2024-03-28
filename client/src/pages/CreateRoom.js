import { useNavigate, useParams } from "react-router-dom";
import { postRoom } from "../api/endpoints";
import useFetchFiles from "../hooks/useFetchFiles";
import useFileHandling from "../hooks/useFileHandling";
import useLoadingState from "../hooks/useLoadingState";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RoomObject, SelectedFile } from "../components/RoomObject";

function CreateRoom() {
  const [fields, setFields] = useState({ roomName: "" });

  const { courseID, moduleID } = useParams();

  const course = useSelector((state) => state.course.value);

  const navigate = useNavigate();

  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const { files, updateFiles, updateFile } = useFileHandling();

  const { moduleFiles, courseFiles } = useFetchFiles(courseID, moduleID);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    if (files.length > 0) {
      startLoading();
      try {
        await postRoom(course.id, moduleID, fields.roomName, files);
        navigate(`/courses/${courseID}`);
      } catch (error) {
        console.log(error.message);
        navigate("/error");
      } finally {
        stopLoading();
      }
    }
  };

  const isCreateButtonDisabled =
    files.length < 1 || fields.roomName.trim() === "";

  return (
    <div className="w-full h-screen max-h-screen flex md:flex-col items-start justify-start">
      <div className="w-1/3 md:w-full md:pt-[8rem h-screen bg-light pt-[8rem] border-r">
        <div className="w-full bg-light flex flex-col items-start justify-start gap-4">
          <div className="w-full border-b pb-3">
            <h1 className="text-xl tracking-wide mx-4">Create Room</h1>
          </div>

          <div className="w-full flex items-start justify-between px-5 lg:px-2">
            <h3 className="text-md tracking-wide rounded-sm">Room Name:</h3>
            <input
              className="rounded-sm text-dark text-md tracking-wide border-b bg-transparent"
              label="roomName"
              name="roomName"
              id="roomName"
              type="text"
              value={fields.roomName}
              onChange={handleInputChange}
              placeholder="Enter Room Name"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-3 mx-5">
            <h1 className="text-md tracking-wide rounded-sm">Room Objects:</h1>
            <div className="max-h-80 overflow-y-auto">
              {files.map((file, index) => (
                <SelectedFile
                  key={index}
                  index={index}
                  file={file}
                  onUpdate={updateFile}
                />
              ))}
            </div>
          </div>
          <div className="w-full flex items-center justify-evenly mt-3">
            <button
              className="bg-red-700 py-2 w-[30%] rounded-md disabled:bg-red-400 text-light"
              disabled={isCreateButtonDisabled || isLoading}
              onClick={handleCreateRoom}
            >
              {isLoading ? <span>Creating Room...</span> : <span>Submit</span>}
            </button>
            <button
              className="bg-gray-700 py-2 w-[30%] rounded-md text-light disabled:bg-gray-300"
              onClick={() => navigate(`/courses/${courseID}`)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="w-2/3 md:w-full h-screen max-h-screen">
        <div className="w-full flex flex-col items-start justify-around mt-[15%] p-10">
          <div className="w-full flex flex-col max-h-72 overflow-y-auto border p-3">
            <h1 className="text-xl tracking-wide font-bold">Module Items</h1>

            {moduleFiles.map((file) => (
              <RoomObject key={file.id} updateFiles={updateFiles} file={file} />
            ))}
          </div>

          <div className=" w-full flex flex-col max-h-72 overflow-y-auto border p-3">
            <h1 className="text-xl tracking-wide font-bold">Course Items</h1>
            {courseFiles.map((file) => (
              <RoomObject key={file.id} updateFiles={updateFiles} file={file} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateRoom;

