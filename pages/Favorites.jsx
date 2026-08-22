import "../css/Favorites.css"
import { useMusicContext } from "../contexts/MusicContext";
import MusicCard from "../components/MusicCard"

function Favorites(){
  const { favorites } = useMusicContext();

  if (favorites.length > 0) {
    return (
      <div className="favorites-section"> 
        <h2 className="favorites-title">
          YOUR FAVORITES!
          </h2>
          <hr className="solid"></hr>
        <div className="music-grid">
          {favorites.map((song) => (
            <MusicCard song={song} key={song.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>no favorites yet?</h2>
      <p>start adding favorites so they appear here!</p>
    </div>
  );
}

export default Favorites;
