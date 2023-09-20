import React from "react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">Error</h1>
        <p className="fs-3"> <span class="text-danger">Opps!</span> Something has gone wrong.</p>
        <p className="lead">Your request could not be processed.</p><a href="/#/courses" class="btn btn-primary">Go Home</a>
      </div>
    </div>
    </>
  );
};

export default NotFound;