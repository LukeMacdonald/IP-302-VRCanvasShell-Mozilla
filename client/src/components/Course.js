import React from "react";
import "../assets/styles/components.css";
import { setCourse } from "../redux/reducers";
import { useDispatch } from "react-redux";
import { Card } from "react-bootstrap";

function Course(props) {
  const course = props.course;
  const dispatch = useDispatch();
  return (
    <a className="course-card" href={`/#/courses/${course.id}`} onClick={() => dispatch(setCourse(props.course))}>
      <Card className="text-white bg-dark mb-3 " style={{ width: "100%"}}>
        <Card.Header className='course-card-header'></Card.Header>
        <Card.Body>
          <Card.Title style={{ fontSize: '2rem' }}>{course.name}</Card.Title>
          <div>
            <h6>{course.course_code}</h6>
            <h6>{course.time_zone}</h6>
          </div>
        </Card.Body>
      </Card>
    </a>
  );
}

export default Course;