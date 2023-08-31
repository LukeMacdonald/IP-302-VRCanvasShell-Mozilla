import React from "react";

const NotFound = () => {
  return (
    <div class="d-flex align-items-center justify-content-center vh-100">
            <div class="text-center">
                <h1 class="display-1 fw-bold">Error</h1>
                <p class="fs-3"> <span class="text-danger">Opps!</span> Something has gone wrong.</p>
                <p class="lead">
                    Your request could not be processed.
                  </p>
                <a href="/" class="btn btn-primary">Go Home</a>
            </div>
        </div>
  );
};

export default NotFound;