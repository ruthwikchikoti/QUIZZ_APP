import React, { useState, useEffect } from 'react';
import QuizSelection from './components/QuizSelection';
import Question from './components/Question';
import Summary from './components/Summary';
import ThemeToggle from './components/ThemeToggle';
import WelcomeScreen from './components/ WelcomeScreen';
import HighScores from './components/HighScores';
import Login from './components/Login';
import { fetchQuestions } from './data/quizzes';
import useLocalStorage from './hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/App.module.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [difficulty, setDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [showWelcome, setShowWelcome] = useState(true);
  const [highScores, setHighScores] = useLocalStorage('highScores', {});
  const [error, setError] = useState(null);
  const [showHighScores, setShowHighScores] = useState(false);
  const [userName, setUserName] = useLocalStorage('userName', '');

  useEffect(() => {
    if (difficulty) {
      fetchQuestions(difficulty, numQuestions)
        .then(setQuestions)
        .catch(err => setError("Failed to fetch questions. Please try again."));
    }
  }, [difficulty, numQuestions]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleQuizStart = (selectedDifficulty, selectedNumQuestions) => {
    setDifficulty(selectedDifficulty);
    setNumQuestions(selectedNumQuestions);
    setShowWelcome(false);
    setError(null);
  };

  const handleAnswer = (answers) => {
    setUserAnswers([...userAnswers, answers]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSummary(true);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((total, answers, index) => {
      const correctAnswer = questions[index].correct_answer;
      const isCorrect = Array.isArray(correctAnswer)
        ? correctAnswer.every(answer => answers.includes(answer)) && answers.length === correctAnswer.length
        : answers.includes(correctAnswer);
      return total + (isCorrect ? 1 : 0);
    }, 0);
  };

  const saveHighScore = (score) => {
    const newHighScores = { ...highScores };

    if (!Array.isArray(newHighScores[difficulty])) {
      newHighScores[difficulty] = [];
    }

    newHighScores[difficulty].push(score);
    setHighScores(newHighScores);
  };

  const restartQuiz = () => {
    const score = calculateScore();
    saveHighScore(score);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowSummary(false);
    setShowWelcome(true);
    setError(null);
  };

  const handleLogin = (name) => {
    setUserName(name);
    setShowWelcome(true);
  };

  if (!userName) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <div className={styles.topRightButtons}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <FontAwesomeIcon icon={faUser} className={styles.userIcon} onClick={() => setShowHighScores(!showHighScores)} />
      </div>
      <h1 className={styles.title}>🧠 Super Quiz Challenge 🚀</h1>
      <p>Welcome, {userName}!</p>
      {error && <div className={styles.error}>{error}</div>}

      {showWelcome && (
        <WelcomeScreen onStart={handleQuizStart} />
      )}

      {!showWelcome && !showSummary && questions.length > 0 && (
        <Question
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
        />
      )}

      {showSummary && (
        <Summary
          questions={questions}
          userAnswers={userAnswers}
          onRestart={restartQuiz}
        />
      )}

      {showHighScores && (
        <HighScores highScores={highScores} />
      )}
    </div>
  );
}

export default App;
