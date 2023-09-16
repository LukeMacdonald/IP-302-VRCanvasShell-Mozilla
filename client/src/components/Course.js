import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";
import { setCourse } from "../storage/reducers";
import { useDispatch } from "react-redux";

function Course(props) {
  const course = props.course;
  console.log(course);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLinkClick = () => {
    
    dispatch(setCourse(props.course));
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