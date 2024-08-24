import React from 'react';
import styles from '../styles/Summary.module.css';

function Summary({ questions, userAnswers, onRestart }) {
  const score = userAnswers.reduce((total, answers, index) => {
    const correctAnswers = questions[index].correct_answer;
    const isCorrect = Array.isArray(correctAnswers)
      ? correctAnswers.every(answer => answers.includes(answer)) && answers.length === correctAnswers.length
      : answers.includes(correctAnswers);
    return total + (isCorrect ? 1 : 0);
  }, 0);

  const percentage = (score / questions.length) * 100;

  let message = '';
  let emoji = '';
  if (percentage >= 80) {
    message = 'Excellent job! You\'re a quiz master!';
    emoji = '🎉';
  } else if (percentage >= 60) {
    message = 'Good work! Keep practicing to improve.';
    emoji = '👍';
  } else {
    message = 'Nice try! There\'s room for improvement.';
    emoji = '😊';
  }

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <h2>Quiz Summary</h2>
        <p>Your Score: {score} / {questions.length} {emoji}</p>
        <p className={styles.message}>{message}</p>
      </div>
      <div className={styles.questionReview}>
        {questions.map((question, index) => {
          const correctAnswer = Array.isArray(question.correct_answer) 
            ? question.correct_answer 
            : [question.correct_answer];
          const isCorrect = Array.isArray(question.correct_answer)
            ? question.correct_answer.every(answer => userAnswers[index].includes(answer)) && 
              userAnswers[index].length === question.correct_answer.length
            : userAnswers[index].includes(question.correct_answer);

          return (
            <div key={index} className={styles.questionItem}>
              <p className={styles.questionText}>{question.question}</p>
              <p className={styles.userAnswer}>
                Your answer: <span>{userAnswers[index]}</span>
              </p>
              <p className={styles.correctAnswer}>
                Correct answer: {correctAnswer.join(', ')}
              </p>
              <p className={styles.explanation}>
                Explanation: {question.explanation}
              </p>
            </div>
          );
        })}
      </div>
      <button className={styles.restartButton} onClick={onRestart}>Start New Quiz</button>
    </div>
  );
}

export default Summary;
