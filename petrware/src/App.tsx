import { useState } from 'react'
import './App.css'
import Homepage from './components/homepage';
import EndScreen from './components/endScreen';

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
            {currentPage == "home" && <Homepage startGame={() => goToPage("end")} />}
            {currentPage == "game1" && <span>Put game pages here</span>}
            {currentPage == "end" && <EndScreen score={totalScore} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
