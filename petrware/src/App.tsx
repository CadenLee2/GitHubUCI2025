import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage';
import MazeMinigame from './maze_minigame/MazeMinigame';
import MapScreen from './components/MapScreen';
import EndScreen from './components/EndScreen';
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

/** The ordered list of all pages that the player will encounter */
const PAGES_PROGRESSION = [
  "home",
  "map1",
  "game1",
  "map2",
  "end"
];

const MAP_DESCRIPTIONS: Record<string, string> = {
  "map1": "You line up at the starting line, but realize you've lost something...",
  "map2": "You're done!"
}

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

  function finishMinigame(pointsWon: number) {
    setTotalScore(totalScore + pointsWon);
    goToNextPage();
  }

  return (
    <>
      <div className="outer-container">
        <div className="main-box">
          <ScoreBar totalScore={totalScore} />
          <div className="inner-content">
            {currentPage.startsWith("map") && <MapScreen
              currentPage={currentPage}
              proceed={goToNextPage}
              description={MAP_DESCRIPTIONS[currentPage]}
            />}
            {currentPage == "home" && <Homepage startGame={goToNextPage} />}
            {currentPage == "game1" && <MazeMinigame finishGame={finishMinigame} />}
            {currentPage == "end" && <EndScreen score={totalScore} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
