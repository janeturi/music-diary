import MusicCard from "../components/MusicCard"
import {useState, useEffect} from "react"
import {search} from "../services/api"
import {getTopTracks} from "../services/api2"

import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [music, setMusic] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const loadTopTracks = async () => {
            try {
                const topTracks = await getTopTracks()
                setMusic(topTracks)
            } catch (err) {
                console.log(err)
                setError("Failed to load songs!")
            }
            finally {
                setLoading(false)
            }
        }


        loadTopTracks()
        
        
    }, [])
    
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return
        setLoading(true) 
        try{
            const searchResults = await search(searchQuery)
            setMusic(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search songs..")
        } finally {
            setLoading(false)
        }




        setSearchQuery("");
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                type="text" 
                placeholder="What are you listening to?" 
                className="search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

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
