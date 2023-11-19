// quiz.js

import { createSlice } from "@reduxjs/toolkit";

const questions = [
  {
    id: 1,
    questionText: "What is the capital city of Sweden?",
    options: ["Oslo", "Stockholm", "Helsinki", "Copenhagen"],
    correctAnswerIndex: 1,
  },
  {
    id: 2,
    questionText: "What is the official language of Sweden?",
    options: ["English", "Spanish", "Swedish", "German"],
    correctAnswerIndex: 2,
  },
  {
    id: 3,
    questionText: "Which is the highest mountain in Sweden?",
    options: ["Kebnekaise", "Snøhetta", "Galdhøpiggen", "Halti"],
    correctAnswerIndex: 0,
  },
  {
    id: 4,
    questionText: "What is the currency of Sweden?",
    options: ["Euro", "Dollar", "Swedish Krona", "Danish Krone"],
    correctAnswerIndex: 2,
  },
  {
    id: 5,
    questionText:
      "Which day corresponds to the famous Midsummer festival in Sweden?",
    options: ["June 21", "May 1", "August 15", "December 24"],
    correctAnswerIndex: 0,
  },
  {
    id: 6,
    questionText:
      "Which city in Sweden is listed as a UNESCO World Heritage site?",
    options: ["Malmö", "Uppsala", "Visby", "Gothenburg"],
    correctAnswerIndex: 2,
  },
  {
    id: 7,
    questionText: "Who are the members of the famous Swedish pop group ABBA?",
    options: [
      "Björn, Benny, Agnetha, Anni-Frid",
      "John, Paul, George, Ringo",
      "Mick, Keith, Charlie, Ronnie",
      "Freddie, Brian, Roger, John",
    ],
    correctAnswerIndex: 0,
  },
];

const initialState = {
  questions,
  answers: [],
  currentQuestionIndex: 0,
  quizOver: false,
  score: 0,
  minScoreToLose: -10,
  lossHandled: false,
  timer: 0,
};

export const quiz = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    submitAnswer: (state, action) => {
      const { questionId, answerIndex } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (!question) {
        throw new Error(
          "Could not find question! Check to make sure you are passing the question id correctly."
        );
      }

      if (question.options[answerIndex] === undefined) {
        throw new Error(
          `You passed answerIndex ${answerIndex}, but it is not in the possible answers array!`
        );
      }

      const isCorrect = question.correctAnswerIndex === answerIndex;

      // Update the score based on correctness
      if (isCorrect) {
        state.score += 10; // You can adjust the points for correct answers
      } else {
        state.score -= 5; // You can adjust the points deducted for incorrect answers
      }

      state.answers.push({
        questionId,
        answerIndex,
        question,
        answer: question.options[answerIndex],
        isCorrect,
      });
    },

    goToNextQuestion: (state) => {
      if (state.currentQuestionIndex + 1 === state.questions.length) {
        state.quizOver = true;
    
        // Check if the user loses
        if (state.score < state.minScoreToLose && !state.lossHandled) {
          state.quizOver = true;
          state.lossHandled = true; // İşlevi yalnızca bir kez çağır
    
          // Additional actions when the user loses can be added here
          handleLoss(); // Loss işlevini çağır
    
          // console.log("Oh no! You lost! Try again for a better score.");
        }
      } else {
        // Increment the currentQuestionIndex only if the user hasn't lost
        if (!state.quizOver) {
          state.currentQuestionIndex += 1;
        }
      }
    },
    
    
    

    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex - 1 < 0) {
        state.quizOver = false;
      } else {
        state.currentQuestionIndex -= 1;
      }
    },

    restart: () => {
      return initialState;
    },
  },
});
