import { useEffect, useState } from "react";
import { getCourses } from "../data/data";
import Course from "../components/Course";

function Courses(props) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []); // The empty array [] ensures that this effect runs only once, similar to componentDidMount

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