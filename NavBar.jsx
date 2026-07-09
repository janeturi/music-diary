
import { Link } from "react-router-dom"
import "../css/NavBar.css"


function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand">MusicDiary</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/playlists" className="nav-link">Playlists</Link>
        <Link to="/music" className="nav-link">Music</Link>
      </div>
      
    </nav>
  );
}

export default NavBar

// need to implement feature to handle user clicking on this when they're not logged in