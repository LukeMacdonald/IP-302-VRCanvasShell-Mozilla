import { useEffect, useState, useCallback } from "react";
import { getCourses } from "../data/data";
import Course from "../components/Course";
import { useNavigate } from "react-router-dom";

function Courses(props) {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      navigate('/error');
      console.error("Error fetching courses:", error);
    }
  }, [navigate]); // Include 'navigate' in the dependency array

  useEffect(() => {
    fetchCourses(); // Call the callback function here
  }, [fetchCourses]);  // The empty array [] ensures that this effect runs only once, similar to componentDidMount

  return (
    <div style={{margin:'3rem 5rem'}}>
      <h1>Courses</h1>
      <ul>
        {courses.map((course, index) => (
            <Course key={index} course={course}/>
        ))}
      </ul>
    </div>
  );
}

export default Courses;