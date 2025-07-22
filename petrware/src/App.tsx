import { useState } from 'react'
import './App.css'

/** The bar at the top that shows the score */
function ScoreBar(props: {totalScore: number}) {
  const { totalScore } = props;

  return (
    <div className="score-bar">
      <span>
        Score: <b>{totalScore}</b>
      </span>
    </div>
  )
}

/** The first screen that appears when the user enters the game */
function Homepage(props: { startGame: () => void }) {
  const { startGame } = props;

  return (
    <div className="home">
      <h1>Petrware</h1>
      <div>
        <span>Welcome!</span>
      </div>
      <button onClick={startGame}>Start</button>
    </div>
  );
}

/** The main display of the app */
function App() {
  /** The game state */
  const [totalScore, setTotalScore] = useState(0)
  const [currentPage, setCurrentPage] = useState("home");

  function goToPage(newPage: string) {
    setCurrentPage(newPage);
  }

  return (
    <>
      <div className="outer-container">
        <div className="main-box">
          <ScoreBar totalScore={totalScore} />
          <div className="inner-content">
            {currentPage == "home" && <Homepage startGame={() => goToPage("game1")} />}
            {currentPage == "game1" && <span>Put game pages here</span>}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
