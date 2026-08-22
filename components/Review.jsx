import { Modal } from "@mantine/core"
import { useState, useEffect } from "react"
import "../css/Review.css"
import { useAuth } from "../contexts/AuthContext"

function Review({ opened, onClose, song, onSubmitReview }) {
  const [rating, setRating] = useState(0)
  const [existingReviews, setExistingReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const myExistingReview = existingReviews.find((r) => r.user_id === user?.id)
  const averageRating = existingReviews.length > 0
    ? (existingReviews.reduce((sum, r) => sum + r.rating, 0) / existingReviews.length).toFixed(1)
    : null
  const reviewCount = existingReviews.length
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => {
    const count = existingReviews.filter((r) => r.rating === star).length
    const percent = existingReviews.length > 0 ? (count / existingReviews.length) * 100 : 0
    return { star, count, percent }
  })

  useEffect(() => {
    if (!opened || !song) return

    setLoading(true)
    fetch(`http://localhost:3000/api/reviews/${encodeURIComponent(song.id)}`)
      .then((res) => res.json())
      .then((data) => {
        setExistingReviews(data)
        setLoading(false)

        const mine = data.find((r) => r.user_id === user?.id)
        if (mine) {
          setRating(mine.rating)
        } else {
          setRating(0)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reviews:", err)
        setLoading(false)
      })
  }, [opened, song])

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const review = {
      songId: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      image: song.image,
      rating,
      text: formData.get("reviewText"),
    }

    try {
      const res = await fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      })

      if (!res.ok) {
        const errData = await res.json()
        console.error("Failed to save review:", errData)
        return
      }

      const saved = await res.json()
      setExistingReviews((prev) => {
        const withoutMine = prev.filter((r) => r.user_id !== user?.id)
        return [saved, ...withoutMine]
      })
    } catch (err) {
      console.error("Failed to save review:", err)
    }

    e.target.reset()
  }
  if (!song) return null

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      classNames={{
        content: "modalContent modalContentWide",
        body: "modalBody",
      }}
    >
      <div className="modalTitle">
        REVIEW <span className="d">"{song.title}"</span>
      </div>

      <div className="reviewLayout">
        <div className="reviewLeftCol">
          <img
            className="reviewAlbumArt"
            src={song.image || "/placeholder-cover.png"}
            alt={song.title}
          />
          <p className="reviewSongTitle">{song.title}</p>
          <p className="reviewSongArtist">{song.artist}</p>

          {!loading && existingReviews.length > 0 && (
            <div className="ratingSummary">
              <div className="ratingSummaryHeader">
                <span className="ratingSummaryAvg">★ {averageRating}</span>
                <span className="ratingSummaryCount">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </div>

              <div className="ratingDistribution">
                {ratingCounts.reverse().map(({ star, count, percent }) => (
                  <div className="ratingBarRow" key={star}>
                    <span className="ratingBarLabel">{star}★</span>
                    <div className="ratingBarTrack">
                      <div className="ratingBarFill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="ratingBarCount">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reviewRightCol">
          
          <div className="existingReviewsScroll">
            {loading && <p className="reviewsLoading">loading reviews...</p>}
            {!loading && existingReviews.length === 0 && (
              <p className="reviewsEmpty">no reviews yet — be the first!</p>
            )}
            {!loading &&
              existingReviews.map((r) => {
                const wasEdited =
                  r.updated_at &&
                  r.created_at &&
                  new Date(r.updated_at) - new Date(r.created_at) > 5000

                return (
                  <div className="existingReview" key={r.id}>
                    <div className="existingReviewStars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`star ${star <= r.rating ? "filled" : ""}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="existingReviewText">{r.text}</p>
                    <p className="existingReviewDate">
                      {new Date(r.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {wasEdited && <span className="editedTag"> (edited)</span>}
                    </p>
                    <p className="existingReviewAuthor">
                      {r.user_id === user?.id ? "you" : r.username || "anonymous"}
                    </p>
                  </div>
                )
              })}
          </div>
          
          {user ? (
          <form onSubmit={handleSubmit} className="reviewForm">
            <label className="modalLabel">
              Rating
              <div className="starRating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </label>

            <label className="modalLabel">
              Your Review
              <textarea
                key={myExistingReview?.id || "new"}
                name="reviewText"
                className="modalInput modalTextarea"
                rows={2}
                required
                defaultValue={myExistingReview?.text || ""}
              />
            </label>

            <input
              type="submit"
              value={myExistingReview ? "UPDATE REVIEW" : "POST REVIEW"}
              className="modalSubmit"
              disabled={rating === 0}
            />
          </form>
          ) : (
            <div className="loginPrompt">
              <p> Log in to leave a review! </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
export default Review
