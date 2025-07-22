import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function ScoreBar(props: {totalScore: number}) {
  const { totalScore } = props;

  return (
    <div className="score-bar">
      Score: {totalScore}
    </div>
  )
}

function App() {
  const [totalScore, setTotalScore] = useState(0)

  return (
    <>
      <div className="outer-container">
        <div className="main-box">
        <ScoreBar totalScore={totalScore} />
          <h1>Petrware</h1>
          <div>
            <span>Hi, welcome!</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
