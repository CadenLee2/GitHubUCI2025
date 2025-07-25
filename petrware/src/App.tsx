import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage';
import MazeMinigame from './maze_minigame/MazeMinigame';
import EndScreen from './components/EndScreen';
import RoadMinigame from './road_minigame/RoadMinigame';
import PhotoGame from './components/PhotoGame/PhotoGame';

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

  function finishGame(pointsWon: number) {
    setTotalScore(totalScore + pointsWon);
    setCurrentPage("end");
  }

  return (
    <>
      <div className="outer-container">
        <div className="main-box">
          <ScoreBar totalScore={totalScore} />
          <div className="inner-content">
            {currentPage == "home" && <Homepage startGame={() => goToPage("game1")} />}
            {currentPage == "game1" && <MazeMinigame finishGame={finishGame} />}
            {currentPage == "end" && <EndScreen score={totalScore} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
