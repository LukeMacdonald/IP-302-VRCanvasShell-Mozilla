import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { spawnQuiz } from "../api/endpoints";

const QuizStart = () => {
  const { quizID, courseID } = useParams();
  const [token, setNewToken] = useState("");
  console.log(quizID);

  useEffect(() => {
    // Fetch data or perform actions based on quizID if needed
    console.log("Quiz ID from URL:", quizID);
  }, [quizID]);

  const handleLaunchQuiz = async () => {
    const response = await spawnQuiz(token, quizID, courseID);

    const url = response.url;

    if (url) {
      window.open(url, "_blank");
    }

    console.log(response);
  };

  return (
    <div
      className="mt-5 flex flex-col justify-start items-center gap-6"
      style={{ width: "50%", margin: "0 auto" }}
    >
      <h2 className="text-4xl mb-4">Launch Quiz</h2>
      <input
        type="text"
        placeholder="Enter Canvas Token"
        value={token}
        className="w-full py-3 px-2 border-2 rounded-lg"
        onChange={(e) => setNewToken(e.target.value)}
      />
      <Button
        variant="danger"
        className="bg-red-600 py-3 w-2/3 font-bold text-lg"
        onClick={handleLaunchQuiz}
        style={{ marginTop: "2rem" }}
      >
        Start
      </Button>
    </div>
  );
};

export default QuizStart;
