import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { quiz } from "../reducers/quiz"; // quiz import edildi
import './CurrentQuestion.css'; // Yeni eklenen satır
import ProgressBar from "./ProgressBar";


export const CurrentQuestion = () => {
  const dispatch = useDispatch();

  const question = useSelector((state) => state.quiz.questions[state.quiz.currentQuestionIndex]);
  const score = useSelector((state) => state.quiz.score);
  const quizOver = useSelector((state) => state.quiz.quizOver);
  const isLastQuestion = useSelector(
    (state) => state.quiz.currentQuestionIndex === state.quiz.questions.length - 1
  );
  const selectedAnswerIndex = useSelector((state) => state.quiz.answers.find(answer => answer.questionId === question.id)?.answerIndex);

  const isAnswerCorrect = selectedAnswerIndex !== undefined && selectedAnswerIndex === question.correctAnswerIndex;

  const correctCount = useSelector(
    (state) => state.quiz.answers.filter((a) => a.isCorrect).length
  );
  const incorrectCount = useSelector(
    (state) => state.quiz.answers.filter((a) => !a.isCorrect).length
  );

  const totalQuestions = useSelector((state) => state.quiz.questions.length);
  const currentQuestionIndex = useSelector((state) => state.quiz.currentQuestionIndex + 1);

  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [isSeeResultsClicked, setIsSeeResultsClicked] = useState(false);
  const [showRestartButton, setShowRestartButton] = useState(false);

  if (!question) {
    return <h1>Oh no! I could not find the current question!</h1>;
  }

  if (quizOver) {
    // Kullanıcı kaybettiğinde yapılacak işlemleri buraya ekleyebilirsiniz.
    return <h1>Oh no! You lost!</h1>;
  }

  const handleLoss = () => {
    // Burada kullanıcı kaybettiğinde yapılması gereken işlemleri gerçekleştirin
    console.log("Oh no! You lost! Try again for a better score.");
    // Örneğin, kaybettiğini bildiren bir modal gösterebilir veya başka bir işlem yapabilirsiniz.
  };
  
  const isFirstQuestion = useSelector(
    (state) => state.quiz.currentQuestionIndex === 0
  );

  const handlePreviousQuestion = () => {
    dispatch(quiz.actions.goToPreviousQuestion());
    setIsAnswerSelected(true);
  };

  const handleAnswer = (answerIndex) => {
    console.log("Answer submitted:", answerIndex);
    dispatch(quiz.actions.submitAnswer({ questionId: question.id, answerIndex }));
    setIsAnswerSelected(true);
  };

  const handleNextQuestion = () => {
    dispatch(quiz.actions.goToNextQuestion());
    setIsAnswerSelected(false);
  };

  const handleSeeResults = () => {
    setIsSeeResultsClicked(true);
    setShowRestartButton(true);
  };
  

  const handleRestartQuiz = () => {
    dispatch(quiz.actions.restart());
    setIsSeeResultsClicked(false);
    setShowRestartButton(false);
  };

  const correctAnswer = question.options[question.correctAnswerIndex];
  const selectedAnswer = selectedAnswerIndex !== undefined ? question.options[selectedAnswerIndex] : null;

  return (
    <div>
      <ProgressBar />
      <h1>{question.questionText}</h1>
      <p>{`Question ${currentQuestionIndex} / ${totalQuestions}`}</p>
      <ul>
        {question.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleAnswer(index)}
            className={`${
              index === selectedAnswerIndex
                ? isAnswerCorrect
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
      <p>Score: {score}</p> {/* Score'u göstermek için bu satırı ekleyin */}
      {selectedAnswer !== null && (
        <p className={isAnswerCorrect ? 'correct-answer' : 'incorrect-answer'}>
          Your Answer: {selectedAnswer}
        </p>
      )}
      {selectedAnswer !== null && (
        <p className="correct-answer">
          Correct Answer: {correctAnswer}
        </p>
      )}
      {isLastQuestion ? (
        <>
        <button onClick={handleSeeResults} disabled={!isAnswerSelected}
        className={`see-results-button ${!isAnswerSelected ? 'disabled' : ''}`}
        >
          See Results
        </button>
        {isSeeResultsClicked && (
          <div className="results-info">
          <p className="results-text">Correct answers: {correctCount}</p>
          <p className="results-text">Incorrect answers: {incorrectCount}</p>
          {showRestartButton && (
      <button onClick={handleRestartQuiz}>Restart Quiz</button>
    )}
        </div>
        )}
      </>
      ) : (
        <div>
          {!isFirstQuestion && (
            <button onClick={handlePreviousQuestion} className="previous-button">
              Previous Question
            </button>
          )}
  
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswerSelected}
            className={`next-button ${!isAnswerSelected ? 'disabled' : ''}`}
          >
            Next Question
          </button>
        </div>
      )}
      {question.quizOver && <button onClick={handleRestartQuiz}>Restart Quiz</button>}
    </div>
  );
  
};
