import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";

function Course(props) {
  const course = props.course;
  const navigate = useNavigate();

  const handleLinkClick = () => {
    props.setCourseID(course.id);
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="course-card-link" onClick={handleLinkClick}>
      <div className="course-card">
        <h4>{course.name}</h4>
      </div>
    </div>
  );
}

export default Course;