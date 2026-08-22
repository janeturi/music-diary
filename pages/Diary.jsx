import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ViewReview from "../components/ViewReview"
import Review from "../components/Review"
import "../css/Diary.css"
import "../css/MusicCard.css"

function Diary() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [editingSong, setEditingSong] = useState(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`http://localhost:3000/api/reviews/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to fetch diary:", err))
      .finally(() => setLoading(false))
  }, [user?.id])

  function handleEdit(review) {
    setSelectedReview(null)
    setEditingSong({
      id: review.song_id,
      title: review.title,
      artist: review.artist,
      album: review.album,
      image: review.image,
    })
  }

  function handleReviewSubmit(updatedReview) {
    setReviews((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? { ...r, ...updatedReview } : r))
    )
    setEditingSong(null)
  }

  return (
    <div className="diary-section">
      <h2 className="diary-title">YOUR MUSIC DIARY!</h2>
      <hr className="solid" />

      {loading ? (
        <div className="diary-status-msg">
          <h2>loading your diary...</h2>
        </div>
      ) : reviews.length === 0 ? (
        <div className="diary-empty">
          <h2>no diary entries yet?</h2>
          <p>start reviewing songs so they appear here!</p>
        </div>
      ) : (
        <div className="music-grid">
          {reviews.map((review) => (
            <div
              className="music-card"
              key={review.id}
              onClick={() => setSelectedReview(review)}
            >
              <div className="song-cover">
                <img src={review.image || "/placeholder-cover.png"} alt={review.title} />
              </div>
              <div className="song-info">
                <h1>{review.title}</h1>
                <h2>{review.album}</h2>
                <h3>{review.artist}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewReview
        opened={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
        onEdit={() => handleEdit(selectedReview)}
      />

      <Review
        opened={!!editingSong}
        onClose={() => setEditingSong(null)}
        song={editingSong}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  )
}

export default Diary

