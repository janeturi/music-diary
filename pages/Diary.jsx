import "../css/Diary.css"
import "../css/MusicCard.css"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ViewReview from "../components/ViewReview"
import Review from "../components/Review"

function Diary(){
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [editingSong, setEditingSong] = useState(null)

  function fetchDiary() {
    if (!user) {
      setLoading(false)
      return
    }
    fetch(`http://localhost:3000/api/reviews/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch diary:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    fetchDiary()
  }, [user])

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

  function handleCloseEdit() {
    setEditingSong(null)
    fetchDiary()
  }

  if (loading) {
    return (
      <div className="diary-empty">
        <h2>loading your diary...</h2>
      </div>
    )
  }

  if (reviews.length > 0) {
    return (
      <div className="diary-section"> 
        <h2 className="diary-title">
          YOUR MUSIC DIARY!
        </h2>
        <hr className="solid" />
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

        <ViewReview
          opened={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
          onEdit={() => handleEdit(selectedReview)}
        />

        <Review
          opened={!!editingSong}
          onClose={handleCloseEdit}
          song={editingSong}
        />
      </div>
    );
  }

  return (
    <div className="diary-empty">
      <h2>no diary entries yet?</h2>
      <p>start reviewing songs so they appear here!</p>
    </div>
  );
}

export default Diary;
