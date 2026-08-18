import "../css/MusicCard.css"
import { useDisclosure } from "@mantine/hooks"
import { useMusicContext } from "../contexts/MusicContext"
import Review from "./Review"

function MusicCard({ song }) {
  const { isFavorite, addToFavorites, removeFromFavorites, addReview } = useMusicContext()
  const [opened, { open, close }] = useDisclosure(false)
  const favorite = isFavorite(song.id)
  const maxLength = 32
  const songTitle = song.title

  const displayedTitle =
    songTitle.length > maxLength
      ? songTitle.substring(0, maxLength) + "..."
      : songTitle

  function onFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    if (favorite) removeFromFavorites(song.id)
    else addToFavorites(song)
  }

  return (
    <>
      <div className="music-card" onClick={open}>
        <div className="song-cover">
          <img src={song.image || "/placeholder-cover.png"} alt={song.title} />
          <div className="song-overlay">
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavorite}
            >
              ♡
            </button>
          </div>
        </div>
        <div className="song-info">
          <h1>{displayedTitle}</h1>
          <h2>{song.album}</h2>
          <h3>{song.artist}</h3>
        </div>
      </div>

      <Review opened={opened} onClose={close} song={song} onSubmitReview={addReview} />
    </>
  )
}

export default MusicCard
