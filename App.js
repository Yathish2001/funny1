import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const defaultQuestions = [
  "Do you think I am a good person?",
  "Be honest… don't overthink it 😏",
  "Do you trust your decisions?",
  "So if you trust yourself… I must be a good person right?",
  "If you don't trust yourself… your answer might be wrong 🤔",
  "Let's try again carefully…",
  "Deep down… you know the truth 😌",
  "Why are you still thinking so much? 😅",
  "This is getting serious… final judgment?",
  "Last chance… Am I a good person?"
];

const yesQuestions = [
  "I knew you'd say that! 😊",
  "See? We're on the same page! 🤝",
  "You have excellent judgment! ✨",
  "I knew you were smart! 🧠",
  "Great minds think alike! 🎯",
  "You're my favorite person! 💖",
  "We should be friends! 🌟",
  "You're absolutely right! 🎉",
  "Final confirmation... I'm amazing, right? 😎",
  "LAST TIME... I'm the best, yes?! 🏆"
];

const noQuestions = [
  "Are you sure about that answer? 🤔",
  "Let me rephrase... don't you think I'm good? 😅",
  "Maybe you misunderstood the question? 🤨",
  "Let's try this again... I'm definitely good, right? 😏",
  "I feel like you're not paying attention... I'm good! 😤",
  "Third time's the charm... I'm a good person, yes? 🥺",
  "You're really testing me... but I'm good, admit it! 😤",
  "This is getting ridiculous... I'M A GOOD PERSON! 😠",
  "Final warning... say I'm good or else! 😈",
  "LAST CHANCE... AM I A GOOD PERSON?! 🔥"
];

const noResponses = [
  "Really? Let me convince you...",
  "Interesting choice... but let's continue",
  "Hmm, I see... moving on",
  "Are you sure about that?",
  "Let's explore this further...",
  "That's unexpected... let's proceed",
  "Fascinating... continue we must",
  "You're testing my patience... but okay",
  "Final stretch... think carefully"
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showFinal, setShowFinal] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [questionPath, setQuestionPath] = useState('default'); // 'default', 'yes', or 'no'
  const containerRef = useRef(null);

  const handleAnswer = (answer) => {
    if (currentQuestion < defaultQuestions.length - 1) {
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
      
      // Set question path based on answer
      if (answer === 'yes') {
        setQuestionPath('yes');
      } else if (answer === 'no') {
        setQuestionPath('no');
      }
      
      // Update scales
      setYesScale(prev => Math.min(prev + 0.15, 2.5));
      setNoScale(prev => Math.max(prev - 0.12, 0.3));
      
      // Reset no button position for non-final questions
      setNoPosition({ x: 0, y: 0 });
    } else {
      // Final question - show success screen
      setShowFinal(true);
    }
  };

  const handleNoHover = (e) => {
    if (currentQuestion === defaultQuestions.length - 1) {
      // Last question - make No button run away
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const buttonSize = 40 * noScale; // Approximate button size
        
        // Generate random position within container bounds
        const maxX = rect.width - buttonSize - 20;
        const maxY = rect.height - buttonSize - 100; // Leave space for question
        
        const newX = Math.random() * maxX - maxX / 2;
        const newY = Math.random() * maxY - maxY / 2;
        
        setNoPosition({ x: newX, y: newY });
        setNoHoverCount(prev => prev + 1);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setYesScale(1);
    setNoScale(1);
    setNoPosition({ x: 0, y: 0 });
    setShowFinal(false);
    setNoHoverCount(0);
    setQuestionPath('default');
  };

  const progressPercentage = Math.round(((currentQuestion + 1) / defaultQuestions.length) * 100);
  
  const getCurrentQuestions = () => {
    if (questionPath === 'yes') return yesQuestions;
    if (questionPath === 'no') return noQuestions;
    return defaultQuestions;
  };
  
  const currentQuestions = getCurrentQuestions();

  if (showFinal) {
    return (
      <div className="app-container">
        <div className="final-screen">
          <div className="final-text">
            <h1>
              {questionPath === 'yes' 
                ? "I knew you'd agree! You're awesome! 🎉" 
                : questionPath === 'no'
                ? "Finally! You came around! 😎🔥"
                : "I knew it! You agree I am a good person 😎🔥"
              }
            </h1>
            <p>It only took {progressPercentage}% convincing!</p>
            {noHoverCount > 0 && (
              <p className="fun-fact">You tried to click "No" {noHoverCount} times 😂</p>
            )}
            <p className="path-info">
              {questionPath === 'yes' && "You chose the smart path! 🌟"}
              {questionPath === 'no' && "You made me work for it! 😤"}
              {questionPath === 'default' && "Straight to the point! 👍"}
            </p>
          </div>
          <button className="restart-btn" onClick={resetQuiz}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="quiz-container" ref={containerRef}>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="progress-text">
          Convincing you... {progressPercentage}%
        </div>

        <div className="question-section">
          <h2 className="question-text">
            {currentQuestions[currentQuestion]}
          </h2>
        </div>

        <div className="buttons-container">
          <button
            className="btn yes-btn"
            style={{ transform: `scale(${yesScale})` }}
            onClick={() => handleAnswer('yes')}
          >
            Yes
          </button>

          <button
            className="btn no-btn"
            style={{ 
              transform: `scale(${noScale}) translate(${noPosition.x}px, ${noPosition.y}px)`,
              position: currentQuestion === defaultQuestions.length - 1 ? 'absolute' : 'relative'
            }}
            onClick={() => handleAnswer('no')}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
          >
            No
          </button>
        </div>

        {currentQuestion > 0 && (
          <div className="subtle-hint">
            {noHoverCount > 5 && currentQuestion === defaultQuestions.length - 1 && 
              <p className="giving-up">Just click Yes already! 😄</p>
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
