import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function UnAuthenticatedLayout() {
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage when component is first rendered
    if (storedToken && storedToken.trim() !== "") {
      navigate("/courses"); // Redirect to course page if token exists
    } // Redirect to the home page if the token doesn't exist
  }, [storedToken, navigate]);

  return (
    <main>
      <Outlet />
    </main>
  );
}

function AuthenticatedLayout() {
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage when component is first rendered
    if (!storedToken) {
      navigate("/"); // Redirect to the home page if the token doesn't exist
    }
  }, [storedToken, navigate]);

  if (!storedToken) {
    // Early return if there's no token
    return null;
  }

  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
}

export {UnAuthenticatedLayout, AuthenticatedLayout}
