
import React from "react";
import { useSelector } from "react-redux";
import "./ProgressBar.css";

const ProgressBar = () => {
  const totalQuestions = useSelector((state) => state.quiz.questions.length);
  const answeredQuestions = useSelector((state) => state.quiz.answers.length);

  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
