import { useDisclosure } from "@mantine/hooks"
import { useMusicContext } from "../contexts/MusicContext"
import Review from "./Review"
import "../css/MusicCard.css"

function MusicCard({ song }) {
  const { isFavorite, addToFavorites, removeFromFavorites, addReview } = useMusicContext()
  const [opened, { open, close }] = useDisclosure(false)
  const isFav = isFavorite(song?.id)

  function handleFavoriteToggle(e) {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFav) {
      removeFromFavorites(song.id)
    } else {
      addToFavorites(song)
    }
  }

  const albumDisplay = song?.album || "Unknown Album"
  const artistDisplay = song?.artist || "Unknown Artist"

  return (
    <>
      <div className="music-card" onClick={open}>
        <div className="song-cover">
          <img src={song?.image || "/placeholder-cover.png"} alt={song?.title} />
          <div className="song-overlay">
            <button
              className={`favorite-btn ${isFav ? "active" : ""}`}
              onClick={handleFavoriteToggle}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              ♥
            </button>
          </div>
        </div>
        
        <div className="song-info">
          <h1>
            {song?.title?.length > 32 ? `${song.title.substring(0, 32)}...` : song?.title}
          </h1>
          <h2>{albumDisplay}</h2>
          <h3>{artistDisplay}</h3>
        </div>
      </div>

      <Review 
        opened={opened} 
        onClose={close} 
        song={song} 
        onSubmitReview={addReview} 
      />
    </>
  )
}

export default MusicCard

