import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import { useAuth } from "../contexts/AuthContext"
import WaveText from "../components/Animations"
import Login from "../components/Login"
import "../css/Landing.css"

function Landing() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()
  const [opened, { open, close }] = useDisclosure(false)
  const [loginOpened, { open: openLogin, close: closeLogin }] = useDisclosure(false)
  const [authError, setAuthError] = useState(null)
  const [loading, setLoading] = useState(false)

  const notes = [
    { icon: "♪", top: "30%", left: "40px", size: "32px", delay: "0s" },
    { icon: "♫", top: "45%", left: "10px", size: "48px", delay: "1.5s" },
    { icon: "♬", top: "30%", left: "30px", size: "36px", delay: "0.7s" },
    { icon: "♩", top: "65%", left: "0px", size: "40px", delay: "2.2s" },
    { icon: "♪", top: "80%", left: "50px", size: "28px", delay: "1.1s" },
  ]

  async function handleCreateAccount(e) {
    e.preventDefault()
    setLoading(true)
    setAuthError(null)

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")
    const username = formData.get("username")

    try {
      await signup(username, email, password)
      close()
      navigate("/home", { 
        state: { toast: "Account created! Welcome to your music diary." } 
      })
    } catch (err) {
      console.error("Signup failed:", err)
      setAuthError(err?.message || "Something went wrong during signup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="landing-container">
      <div className="landing-copy">
        <h1 className="Title">
          <WaveText>
            <span>Mus</span>
            <span className="i">i</span>
            <span>c</span>
            <span className="d">D</span>
            <span className="i">i</span>
            <span className="d">ary</span>
          </WaveText>
        </h1>
        
        <p className="tagline">
          <span>listen to music.</span>
          <span>rate it.</span>
          <span>share it.</span>
        </p>

        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
          classNames={{
            content: "modalContent",
            body: "modalBody",
          }}
        >
          <div className="modalTitle">
            JOIN MUSIC<span className="d">DIARY!</span> ♪ <span className="d">♫</span>
          </div>

          {authError && <div className="modalErrorMsg">{authError}</div>}

          <form onSubmit={handleCreateAccount}>
            <label className="modalLabel">
              Email
              <input
                type="email"
                name="email"
                className="modalInput"
                required
              />
            </label>
            
            <label className="modalLabel">
              Username
              <input 
                type="text" 
                name="username" 
                className="modalInput" 
                required 
              />
            </label>
            
            <label className="modalLabel">
              Password
              <input
                type="password"
                name="password"
                className="modalInput"
                required
              />
            </label>

            <input 
              type="submit" 
              value={loading ? "CREATING..." : "SIGN UP!"} 
              className="modalSubmit" 
              disabled={loading} 
            />
          </form>
        </Modal>

        {!loading && user ? (
          <button className="start-btn" onClick={() => navigate("/home")}>
            CONTINUE TO APP
          </button>
        ) : (
          <>
            <button className="start-btn" onClick={open}>
              GET STARTED!
            </button>
            <button className="login-btn" onClick={openLogin}>
              LOG IN
            </button>
          </>
        )}
        
        <Login opened={loginOpened} onClose={closeLogin} />
      </div>

      <div id="vinyl-container">
        {notes.map((note, index) => (
          <span
            key={index}
            className="music-note floating"
            style={{
              top: note.top,
              left: note.left,
              fontSize: note.size,
              animationDelay: note.delay,
              color: index % 2 === 0 ? "#eb9ab2" : "#4b97cf"
            }}
          >
            {note.icon}
          </span>
        ))}
        <div className="vinyl spin"></div>
      </div>
    </div>
  )
}

export default Landing

