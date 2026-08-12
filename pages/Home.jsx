import MusicCard from "../components/MusicCard"
import {useState, useEffect} from "react"
import {search} from "../services/api"
import {getTopTracks} from "../services/api2"
import "../assets/Search.svg"

import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [music, setMusic] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true)
  const [isSearchResults, setIsSearchResults] = useState(false)
  const [lastQuery, setLastQuery] = useState("")

  const loadTopTracks = async () => {
    setLoading(true)
    try {
      const topTracks = await getTopTracks()
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
    // need to make a custom search icon
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="What are you listening to?" 
          className="search-input" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">!</button>
        
      </form>
      <hr className="solid"></hr>

      <div className="title-row">
        <div>
          <h1 className="title">
            {isSearchResults ? "Looking For These?" : "Trending Right Now!"}
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
    </div>
  );
}

export default Home;
