import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const QuizStart = () => {
  const { quizID } = useParams();
  const [token, setNewToken] = useState("");
  console.log(quizID);
  
  useEffect(() => {
    // Fetch data or perform actions based on quizID if needed
    console.log("Quiz ID from URL:", quizID);
  }, [quizID]);

  const handleLaunchQuiz = async () => {

  }

  return (
    <div className="mt-5" style={{ width: '50%', margin: "0 auto" }}>
      <h2>Launch Quiz</h2>
      <input
        type="text"
        placeholder="Enter Canvas Token"
        value={token}
        className='login-input-style'
        onChange={(e) => setNewToken(e.target.value)}
      />
      <Button
        variant="danger"
        className='login-button-style'
        onClick={handleLaunchQuiz}
        style={{marginTop:'2rem', width:'50%'}}
      >Start</Button>
    </div>
  );
}

export default QuizStart;
