import React, { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import useLoadingState from "../hooks/useLoadingState";
import authService from "../redux/authService";
import VR from "../assets/images/vr.gif";
import RMIT from "../assets/images/rmit.png";
import Hubs from "../assets/images/Hubs.png";
import Logo from "../assets/images/canvas.webp";

const Integrations = () => {
  return (
    <div className="w-full flex items-center justify-evenly my-5">
      <a href="https://canvas-hub.com">
        <motion.img
          src={Hubs}
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16"
          alt="hubs"
        />
      </a>
      <a href="https://rmit.instructure.com/">
        <motion.img
          src={Logo}
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16"
          alt="hubs"
        />
      </a>
    </div>
  );
};

const Signup = () => {
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [token, setNewToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setIsLoading(true); // Set loading state to true during login request
    try {
      await authService.signup(id, password, token, dispatch);
      navigate("/courses");
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen min-h-screen flex md:flex-col items-start justify-start">
      <div className="w-1/2 md:w-full h-full flex flex-col justify-center items-center">
        <img src={VR} className="rounded-full h-3/4" alt="" />
      </div>
      <div className="w-1/2 md:w-full h-full bg-dark flex flex-col justify-start items-center">
        <img src={RMIT} className="h-[8rem] w-auto mt-5" alt="" />
        <div className="mt-5 w-full flex flex-col justify-start items-center gap-8">
          <input
            type="text"
            placeholder="Enter RMITID or Email"
            className="w-[60%] p-2.5 rounded-lg"
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            className="w-[60%] p-2.5 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Canvas Token"
            value={token}
            className="w-[60%] p-2.5 rounded-lg"
            onChange={(e) => setNewToken(e.target.value)}
          />
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <motion.button
            className="py-2.5 bg-red-600 rounded-full w-[50%] text-light mt-3"
            whileHover={{ scale: 1.1 }}
            onClick={handleSignup}
            disabled={isLoading} // Disable the button during loading
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Link Account"
            )}
          </motion.button>
          <p className="text-light">
            {" "}
            Already Have an Account?{" "}
            <a href="/" className="hover:underline">
              {" "}
              Sign In{" "}
            </a>
          </p>
          <Integrations />
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [password, setPassword] = useState("");
  const [id, setID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Client-side validation
    if (!id || !password) {
      setErrorMessage("Please provide both ID and password.");
      return;
    }
    startLoading(); // Set loading state to true during login request
    try {
      await authService.login(id, password, dispatch);
      navigate("/courses");
    } catch (error) {
      console.log(error);
      setErrorMessage(`${error.message}. Please try again.`);
    } finally {
      stopLoading(); // Reset loading state after login request completes
    }
  };

  return (
    <div className="w-full h-screen max-h-screen min-h-screen flex md:flex-col items-start justify-start">
      <div className="w-1/2 md:w-full h-full flex flex-col justify-center items-center">
        <img src={VR} className="rounded-full h-3/4" alt="" />
      </div>
      <div className="w-1/2 md:w-full h-full bg-dark flex flex-col justify-start items-center">
        <img src={RMIT} className="h-[8rem] w-auto mt-5" alt="" />
        <div className="mt-5 w-full flex flex-col justify-start items-center gap-8">
          <input
            type="text"
            placeholder="Enter RMITID or Email"
            className="w-[60%] p-2.5 rounded-lg"
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Password"
            value={password}
            className="w-[60%] p-2.5 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <motion.button
            className="py-2.5 bg-red-600 rounded-full w-[50%] text-light mt-3"
            whileHover={{ scale: 1.1 }}
            onClick={handleLogin}
            disabled={isLoading} // Disable the button during loading
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
          </motion.button>
          <p className="text-light">
            {" "}
            Don't Already Have an Account?{" "}
            <a href="/#/signup" className="hover:underline">
              {" "}
              Sign Up{" "}
            </a>
          </p>
          <Integrations />
        </div>
      </div>
    </div>
  );
};

export { Login, Signup };

