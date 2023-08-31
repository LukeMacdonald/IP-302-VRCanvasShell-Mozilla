import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import '../styles/styles.css'
import { setCourseFiles } from "../data/data";

function Signin() {
  
  const [fields, setFields] = useState({
    courseID: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      await setCourseFiles(fields.courseID);
      navigate('/home');
    } catch (error) {
      setErrorMessage("Course Does not Exist!"); // Set error message
    } finally {
      setIsLoading(false); // Set loading state back to false
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
          label="courseID"
          name="courseID"
          id="courseID"
          type="number"
          value={fields.courseID}
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

export default Signin;
