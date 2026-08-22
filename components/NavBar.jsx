import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../css/NavBar.css"

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand">♫</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/diary" className="nav-link">Diary</Link>
        {user && (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar
