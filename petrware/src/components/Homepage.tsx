import './Home.css'

/** The first screen that appears when the user enters the game */
export default function Homepage(props: { startGame: () => void }) {
  // startGame is called once we are ready to move on to the actual game
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
