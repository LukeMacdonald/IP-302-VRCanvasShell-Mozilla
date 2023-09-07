import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { getCourses } from "../data/data";
import '../styles/styles.css'

function TeacherSignin({setCourses}) {
  
  const [fields, setFields] = useState({
    username: "",
    password:"",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Fetch courses data
      const coursesData = await getCourses();
      setCourses(() => ({
        ...coursesData,
      }));
  
   // Call setCourses with fetched courses
      
      navigate('/courses');
    } catch (error) {
      setErrorMessage("Course Does not Exist!");
    } finally {
      setIsLoading(false);
    }
  };

  // Generic change handler.
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update state.
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  return (
    <div className="auth-container">
      <h1 className="auth-header">Welcome Back</h1>
      <form onSubmit={handleSignIn}>
        <FormInput
          label="username"
          name="username"
          id="username"
          type="text"
          value={fields.username}
          onChange={handleInputChange}
          placeholder="Enter Course ID"
          required={true}
        />
        <FormInput
          label="password"
          name="password"
          id="password"
          type="password"
          value={fields.password}
          onChange={handleInputChange}
          placeholder="Enter Course ID"
          required={true}
        />
        <div className="form-group" style={{textAlign:'center'}}>
          <input type="submit" className="btn btn-primary form-input" value="Submit" style={{width:'70%' ,marginTop: '5%'}} disabled={isLoading} />
        </div>
        {errorMessage && (
          <div className="form-group" style={{marginTop:'1rem'}}>
            <span className="text-danger">{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default TeacherSignin;