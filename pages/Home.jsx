import MusicCard from "../components/MusicCard"
import {useState, useEffect} from "react"
import {search} from "../services/api"
import {getTopTracks} from "../services/api2"
import "../assets/Search.svg"
import "../css/Home.css";
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [toast, setToast] = useState(location.state?.toast || null)
  const { user } = useAuth()

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
      navigate(location.pathname, { replace: true, state: {} })
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast])

  const [searchQuery, setSearchQuery] = useState("");
  const [music, setMusic] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)
  const [isSearchResults, setIsSearchResults] = useState(false)
  const [lastQuery, setLastQuery] = useState("")
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadTopTracks = async () => {
    setLoading(true)
    setPage(1)
    try {
      const topTracks = await getTopTracks(1)
      setMusic(topTracks)
      setError(null)
      setIsSearchResults(false)
      setLastQuery("")
    } catch (err) {
      console.log(err)
      setError("Failed to load songs!")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const moreTracks = await getTopTracks(nextPage)
      setMusic((prev) => [...prev, ...moreTracks])
      setPage(nextPage)
    } catch (err) {
      console.log(err)
      setError("Failed to load more songs!")
    } finally {
      setLoadingMore(false)
    }
  }
  

  useEffect(() => {
    loadTopTracks()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return
    if (loading) return
    setLoading(true)
    try {
      const searchResults = await search(searchQuery)
      setMusic(searchResults)
      setError(null)
      setIsSearchResults(true)
      setLastQuery(searchQuery)
    } catch (err) {
      console.log(err)
      setError("Failed to search songs..")
    } finally {
      setLoading(false)
    }

    setSearchQuery("");
  };


  return (
    <>
      {toast && <div className="toastBubble">{toast}</div>}

      <div className="home">
        <div className="header-sect">
          {user && (
            <p className="welcomeMessage">
              welcome back, <span> {user.username || user.email}! </span>
            </p>
          )}

          <form onSubmit={handleSearch} className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
              {isSearchResults ? "Looking For These?" : " check out what's trending right now."}
            </h1>
            {isSearchResults && (
              <h2 className="search-subtitle">Results for "{lastQuery}"</h2>
            )}
          </div>
          {isSearchResults && (
            <button className="back-button" onClick={loadTopTracks}>
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
              <MusicCard song={song} key={song.id}/>
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
  );
}

export default Home;
