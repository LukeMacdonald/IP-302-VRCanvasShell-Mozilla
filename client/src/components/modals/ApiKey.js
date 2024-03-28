import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../assets/styles/components.css";
import { updateToken } from "../../api/endpoints";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/reducers";
export default function UpdateKeyModal(props) {
  const [token, setNewToken] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();
  const handleModuleClick = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await updateToken(username, token);
      dispatch(setToken(response.token));
      setErrMsg("");
      props.setShowModal(false);
    } catch (error) {
      setErrMsg(error.message);
    }
  };

  return (
    <div className="module-container">
      <hr />
      <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update API Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full mx-auto text-center">
            <input
              className="w-full py-2 px-2 border border-black rounded-lg"
              type="text"
              input={token}
              onChange={(e) => {
                setNewToken(e.target.value);
              }}
            />
            {errMsg && (
              <p className="text-red-500 font-semibold text-sm py-2">
                {errMsg}
              </p>
            )}
            <button
              className="w-2/3 py-2 bg-red-500 rounded-md mt-2 text-white"
              onClick={() => handleModuleClick()}
            >
              Update
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
