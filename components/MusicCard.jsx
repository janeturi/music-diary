import "../css/MusicCard.css"
import { useMusicContext } from "../contexts/MusicContext"

function MusicCard({ song }) {
  const {isFavorite, addToFavorites, removeFromFavorites} = useMusicContext()
  const favorite = isFavorite(song.id)

  function onFavorite(e) {
    e.preventDefault()
    console.log("onFavorite fired, song:", song, "current favorite state:", favorite)
    if (favorite) removeFromFavorites(song.id)
    else addToFavorites(song)
  }

  return (
    <div className="music-card">
      <div className="song-cover">
        <img src={song.image || "/placeholder-cover.png"} alt={song.title} />
        <div className="song-overlay">
          <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavorite}>
            ♡
          </button>
        </div>
      </div>
      <div className="song-info">
        <h1>{song.title}</h1>
        <p>{song.artist}</p>
      </div>
    </div>
  )
}

export default MusicCard
