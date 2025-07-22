import './EndScreen.css'

/** The last screen that appears when the user finishes the game */
export default function EndScreen(props: { score: number }) {
  const { score } = props;

  return (
    <div className="end-screen">
      <span>You finished!</span>
      <h1>Your score is: {score}</h1>
    </div>
  );
}
