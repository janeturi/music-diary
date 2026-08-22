import { Modal } from "@mantine/core"
import { useAuth } from "../contexts/AuthContext"

function ViewReview({ opened, onClose, review, onEdit, onDelete }) {
  const { token } = useAuth()

  if (!review) return null

  const wasEdited = review.updated_at && review.created_at && review.updated_at !== review.created_at

  async function handleDelete() {
    const confirmed = window.confirm("Delete this review? This can't be undone.")
    if (!confirmed) return

    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${review.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errData = await res.json()
        console.error("Failed to delete review:", errData)
        return
      }

      onDelete?.(review.id)
      onClose()
    } catch (err) {
      console.error("Failed to delete review:", err)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      classNames={{
        content: "modalContent",
        body: "modalBody",
      }}
    >
      <div className="reviewIconRow">
        <button className="editReviewIcon" onClick={onEdit} aria-label="Edit review">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>

        <button className="deleteReviewIcon" onClick={handleDelete} aria-label="Delete review">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm3-4h6l1 2h4v2H4V5h4l1-2z" />
          </svg>
        </button>
      </div>

      <div className="modalTitle">
        YOUR <span className="d">REVIEW</span> ♪
      </div>

      <div className="reviewSongInfo">
        <img src={review.image || "/placeholder-cover.png"} alt={review.title} />
        <div>
          <p className="reviewSongTitle">{review.title}</p>
          <p className="reviewSongArtist">{review.artist}</p>
        </div>
      </div>

      <div className="starRating viewOnly">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= review.rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>

      <p className="viewReviewText">{review.text}</p>

      {wasEdited && <p className="editedTag">edited</p>}
    </Modal>
  )
}

export default ViewReview
