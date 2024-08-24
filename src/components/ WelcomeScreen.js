import React, { useState } from 'react';
import styles from '../styles/WelcomeScreen.module.css';

function WelcomeScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleStart = () => {
    onStart(difficulty, numQuestions);
  };

  return (
    <div className={styles.welcomeScreen}>
      <h2>🎉 Welcome to the Quiz App! 🎉</h2>
      <p>Get ready to groove with these quizzes! 🌟</p>
      <div className={styles.options}>
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Number of Questions:
          <input
            type="range"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />
          <span>{numQuestions}</span>
        </label>
      </div>
      <button onClick={handleStart} className={styles.startButton}>Start Quiz 🚀</button>
    </div>
  );
}

export default WelcomeScreen;
