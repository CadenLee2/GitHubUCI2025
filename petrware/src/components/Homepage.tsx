import '../App.css'
import './Home.css';
import { useRef, useEffect } from "react";
import PetrCharacter from "../assets/PetrCharacter.png";
import PetrCharacter2 from "../assets/PetrCharacter2.png";

/** The first screen that appears when the user enters the game */
export default function Homepage(props: { startGame: () => void }) {
  // startGame is called once we are ready to move on to the actual game
  const { startGame } = props;
  const petrRef = useRef<null | HTMLImageElement>(null);

  useEffect(() => {
    let animFrame2 = false;
    const petrAnimationId = setInterval(() => {
      if (petrRef && petrRef.current) {
        if (animFrame2) {
          petrRef.current.src = PetrCharacter;
        } else {
          petrRef.current.src = PetrCharacter2;
        }
        animFrame2 = !animFrame2;
      }
    }, 1000);

    return () => {
      clearInterval(petrAnimationId);
    }
  }, []);

  return (
    <div className="uci-bg-wrapper">
      <img className="petr-img" src={PetrCharacter} ref={petrRef} />
      <div className="contained-info" style={{marginRight: 80}}>
        <h1>PetrWare</h1>
        <div>
          <span>Welcome!</span>
        </div>
        <button onClick={startGame}>Start</button>
      </div>
      <span className="credits">
        Created for the 2025 GitHub x UCI Summer Hackathon •{" "}
        <a href="https://github.com/CadenLee2/GitHubUCI2025">Source Code</a>
      </span>
    </div>
  );
}
