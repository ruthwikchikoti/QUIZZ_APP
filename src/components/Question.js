import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import styles from '../styles/Question.module.css';

function Question({ question, onAnswer, currentQuestion, totalQuestions }) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: '', className: '' });

  const correctAnswers = Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer];

  useEffect(() => {
    setShowHint(false);
    setSelectedAnswers([]);
    setSubmitted(false);
    setFeedbackMessage({ text: '', className: '' });
    setTimeLeft(15);
  }, [question]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerSelection = (key) => {
    if (!submitted) {
      setSelectedAnswers(prev => question.type === 'single' || question.type === 'boolean' ?
        [key] : prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) {
      setError('Please select an answer');
      return;
    }

    setError(null);
    setSubmitted(true);

    const isCorrect = correctAnswers.sort().join(',') === selectedAnswers.sort().join(',');
    const messageClass = isCorrect ? 'correct' : 'incorrect';

    setFeedbackMessage({
      text: isCorrect ? "Correct Answer! 🌟" : "Incorrect Answer. 😕",
      className: `${styles.feedback} ${styles[messageClass]} ${styles.animate}`
    });

    setTimeout(() => {
      onAnswer(selectedAnswers);
      setSelectedAnswers([]);
      setSubmitted(false);
      setFeedbackMessage({ text: '', className: '' });
      setTimeLeft(15);
    }, 2000);
  };

  return (
    <div className={styles.questionContainer}>
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
      {feedbackMessage.text && (
        <div className={feedbackMessage.className}>
          {feedbackMessage.text}
        </div>
      )}
      <div className={styles.timer}>Time Left: {timeLeft} seconds</div>
      <div className={styles.questionTop}>
        <h2 className={styles.questionText}>{question.question}</h2>
        <button className={styles.hintButton} onClick={() => setShowHint(!showHint)}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      </div>
      <p className={styles.questionType}>
        {question.type === 'single' && 'Single Choice Question'}
        {question.type === 'multiple_correct' && 'Multiple Choice Question (Select All That Apply)'}
        {question.type === 'boolean' && 'True/False Question'}
      </p>
      <div className={styles.answerOptions}>
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            className={`${styles.answerButton} 
              ${selectedAnswers.includes(key) ? styles.selected : ''} 
              ${submitted ? (correctAnswers.includes(key) ? styles.correct : styles.incorrect) : ''}`}
            onClick={() => handleAnswerSelection(key)}
            disabled={submitted}
          >
            {value}
          </button>
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} onClick={handleSubmit} disabled={submitted}>
          Submit Answer
        </button>
      </div>
      {showHint && <p className={styles.hint}>{question.hint}</p>}
    </div>
  );
}

export default Question;
