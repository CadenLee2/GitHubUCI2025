import '../App.css'

/** One of the intermediary maps that appears */
export default function MapScreen(props: {
  currentPage: string,
  description: string,
  proceed: () => void
}) {
  const { currentPage, description, proceed } = props;

  return (
    <div className="uci-bg-wrapper">
      <div className="contained-info">
        <span>Map: {currentPage}</span>
        <span>{description}</span>
        <button onClick={proceed}>Continue</button>
      </div>
    </div>
  );
}
