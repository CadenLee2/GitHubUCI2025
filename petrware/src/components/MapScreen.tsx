import '../App.css';
import Map1 from '../assets/Map1.png';
import Map2 from '../assets/Map2.png';
import Map3 from '../assets/Map3.png';
import Map4 from '../assets/Map4.png';
import Map5 from '../assets/Map5.png';
import Map6 from '../assets/Map6.png';

/**
  One of the intermediary maps that appears
  currentPage should be formatted like "map1", "map2", and so on, to access assets
*/
export default function MapScreen(props: {
  currentPage: string,
  description: string,
  proceed: () => void
}) {
  const { currentPage, description, proceed } = props;

  function getDesiredAsset() {
    if (currentPage == 'map1') return Map1;
    else if (currentPage == 'map2') return Map2;
    else if (currentPage == 'map3') return Map3;
    else if (currentPage == 'map4') return Map4;
    else if (currentPage == 'map5') return Map5;
    else if (currentPage == 'map6') return Map6;
  }

  const asset = getDesiredAsset();

  return (
    <div className="uci-bg-wrapper">
      <div className="contained-info">
        <img className="map-img" src={asset} />
        <span>{description}</span>
        <button onClick={proceed}>Continue</button>
      </div>
    </div>
  );
}
