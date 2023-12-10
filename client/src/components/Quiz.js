import React from "react";
import { Button} from "react-bootstrap"; // Import Spinner from react-bootstrap
import "../assets/styles/components.css";

function QuizCard(props) {

  const { quiz } = props;

  return (
    <div className="card room-card">
      <div className="row">
        <div className="col">
          <div className="card-body room-card-text">
            <h5 className="room-card-text">{quiz.title}</h5>
              <div className="button-group">
                <Button
                  variant="danger"
                  className="load-room-button" 
                >
                  Create VR Quiz
                </Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizCard;