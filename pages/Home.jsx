import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import MusicCard from "../components/MusicCard"
import { search } from "../services/api"
import { getTopTracks } from "../services/api2"
import "../css/Home.css"
import "../css/MusicCard.css"

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [toast, setToast] = useState(location.state?.toast || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [music, setMusic] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSearchResults, setIsSearchResults] = useState(false)
  const [lastQuery, setLastQuery] = useState("")
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
      navigate(location.pathname, { replace: true, state: {} })
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast, location.pathname, navigate])

  const loadTopTracks = async () => {
    setLoading(true)
    setPage(1)
    setError(null)
    setIsSearchResults(false)
    setLastQuery("")
    setSearchQuery("")

    try {
      const topTracks = await getTopTracks(1)
      setMusic(topTracks)
    } catch (err) {
      console.error("Top tracks loader error:", err)
      setError("Failed to load songs!")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    setError(null)

    try {
      const nextPage = page + 1
      const moreTracks = await getTopTracks(nextPage)
      setMusic((prev) => [...prev, ...moreTracks])
      setPage(nextPage)
    } catch (err) {
      console.error("Pagination loader error:", err)
      setError("Failed to load more songs!")
    } finally {
      setLoadingMore(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const queryStr = searchQuery.trim()
    if (!queryStr || loading) return

    setLoading(true)
    setError(null)

    try {
      const searchResults = await search(queryStr)
      setMusic(searchResults)
      setIsSearchResults(true)
      setLastQuery(queryStr)
    } catch (err) {
      console.error("Search query dispatch error:", err)
      setError("Failed to search songs..")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopTracks()
  }, [])

  return (
    <>
      {toast && <div className="toastBubble">{toast}</div>}

      <div className="home">
        <div className="header-sect">
          {user && (
            <p className="welcomeMessage">
              welcome back, <span>{user.username || user.email}!</span>
            </p>
          )}

          <form onSubmit={handleSearch} className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="What are you listening to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">→</button>
          </form>
        </div>

        <div className="title-row">
          <div>
            <h1 className="title">
              {isSearchResults ? "Looking For These?" : "check out what's trending right now."}
            </h1>
            {isSearchResults && (
              <h2 className="search-subtitle">Results for "{lastQuery}"</h2>
            )}
          </div>
          {isSearchResults && (
            <button className="back-button" onClick={loadTopTracks} title="Clear Search">
              ←
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="music-grid">
            {music.map((song) => (
              <MusicCard song={song} key={song.id} />
            ))}
          </div>
        )}

        {!loading && !isSearchResults && (
          <button
            className="loadMoreButton"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "loading..." : "load more"}
          </button>
        )}
      </div>
    </>
  )
}

export default Home

