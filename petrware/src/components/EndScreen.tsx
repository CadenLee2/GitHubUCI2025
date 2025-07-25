import '../App.css'

/** The last screen that appears when the user finishes the game */
export default function EndScreen(props: { score: number }) {
  const { score } = props;

  return (
    <div className="uci-bg-wrapper">
      <div className="contained-info">
        <span>You finished!</span>
        <h1>Your score is: {score}</h1>
        <button onClick={() => location.reload()}>Play again</button>
      </div>
    </div>
  );
}
