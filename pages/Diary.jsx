import "../css/Diary.css"
import "../css/MusicCard.css"
import { useState } from "react"
import { useMusicContext } from "../contexts/MusicContext";
import ViewReview from "../components/ViewReview"

function Diary(){
  const { reviews } = useMusicContext();
  const [selectedReview, setSelectedReview] = useState(null);

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
