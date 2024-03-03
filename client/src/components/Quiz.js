import React from "react";
import "../assets/styles/components.css";
import { updateQuiz } from "../database/api";


function QuizCard(props) {

  const { quiz, courseID } = props;

  console.log(courseID)

  const handleClick = async () => {
    console.log(courseID.id);
    const description = `Open Quiz in VR: https://http://staff.canvas-hub.com/#/launch-quiz/${quiz.id}`
    quiz.description = description
    await updateQuiz(quiz, courseID);
  }

  return (
    <div className="w-full flex items-center justify-between border border-solid p-2 my-2 rounded-md ">
      <h3 className="font-semibold">{quiz.title}</h3>
      <button 
        className="bg-red-700 py-2 px-3 rounded-md text-light "
        onClick={handleClick}
      >
        Convert to VR 
      </button>
    </div>
  );
}

export default QuizCard;