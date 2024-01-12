import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMyCourses, setCourse } from "../redux/reducers";
import { getCourses } from "../database/api";


function CourseCard(props) {
  const course = props.course;
  const dispatch = useDispatch();

  
  return (
    <a 
      className="m-2 p-2 w-1/2 md:w-full bg-gray-700 text-light rounded-md  hover:bg-gray-900 tracking-wide truncate border-l-4 border-transparent hover:border-red-500" 
      href={`/#/courses/${course.id}`} 
      onClick={() => dispatch(setCourse(props.course))}
    >
      <h1 className="text-3xl py-3">{course.name}</h1>
      <hr/>
      <p className="py-2">{course.course_code}</p>
      <p className="py-2">{course.time_zone}</p>
    </a>
  );
}


function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
      dispatch(setMyCourses(coursesData));
    } catch (error) {
      navigate("/error");
      console.error("Error fetching courses:", error);
    }
  }, [navigate, dispatch]);
  useEffect(() => {
    // Make sequential requests
    async function fetchData() {
      await fetchCourses();
    }
    fetchData();
  }, [fetchCourses]);
  return (
    <div className="w-full flex flex-col justify-start items-start px-5 py-4" >
      <h1 className="self-start text-lg">My Courses</h1>
      <hr className="w-full"/>
      <div className="w-full flex flex-wrap justify-start items-center">
      {courses.map((course, index) => (
        <CourseCard course={course} />
         
        ))}

      </div>

    </div>
  );
}
export default Courses;