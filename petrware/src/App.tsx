import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage';
import MazeMinigame from './maze_minigame/MazeMinigame';
import MapScreen from './components/MapScreen';
import EndScreen from './components/EndScreen';

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

/** The ordered list of all pages that the player will encounter */
const PAGES_PROGRESSION = [
  "home",
  "map1",
  "game1",
  "map2",
  "end"
];

/** The main display of the app */
function App() {
  /** The game state */
  const [totalScore, setTotalScore] = useState(0)
  const [currentPage, setCurrentPage] = useState("home");

  function goToNextPage() {
    const nextPageIndex = PAGES_PROGRESSION.findIndex(p => p == currentPage) + 1;
    if (nextPageIndex < 0 || nextPageIndex >= PAGES_PROGRESSION.length) {
      console.error("ERR: Cannot proceed to next page from " + currentPage + " becasue next page not defined");
      return;
    }
    setCurrentPage(PAGES_PROGRESSION[nextPageIndex]);
  }

  function finishGame(pointsWon: number) {
    setTotalScore(totalScore + pointsWon);
    goToNextPage();
  }

  return (
    <>
      <div className="outer-container">
        <div className="main-box">
          <ScoreBar totalScore={totalScore} />
          <div className="inner-content">
            {currentPage == "home" && <Homepage startGame={goToNextPage} />}
            {currentPage == "map1" && <MapScreen
              currentPage={currentPage}
              proceed={goToNextPage}
              description="Ready to start?"
            />}
            {currentPage == "game1" && <MazeMinigame finishGame={finishGame} />}
            {currentPage == "map2" && <MapScreen
              currentPage={currentPage}
              proceed={goToNextPage}
              description="You're done!"
            />}
            {currentPage == "end" && <EndScreen score={totalScore} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
