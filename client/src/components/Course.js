import React from "react";
import { Link } from "react-router-dom";

function Course(props) {
  const course = props.course;

  const linkStyle = {
    textDecoration: "none", // Remove underline
    color: "black", // Set text color to black
  };

  return (
    <Link to={`/courses/${course.id}`} style={linkStyle}>
      <div
        style={{
          width: '25%',
          backgroundColor: '#e6e6e6',
          borderRadius: '10px',
          padding: '3rem',
        }}
      >
        <h4>{course.name}</h4>
      </div>
    </Link>
  );
}

export default Course;