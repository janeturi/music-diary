import { Modal } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Login({ opened, onClose }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      await login(email, password)
      onClose()
      navigate("/home")
    } catch (err) {
      console.error("Login failed:", err)
      setError(err?.message || "Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
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
      <div className="modalTitle">
        WELCOME <span className="d">BACK!</span> ♪
      </div>

      {error && <div className="modalErrorMsg">{error}</div>}

      <form onSubmit={handleLogin}>
        <label className="modalLabel">
          Email
          <input
            type="email"
            name="email"
            className="modalInput"
            autoComplete="email"
            required
          />
        </label>
        
        <label className="modalLabel">
          Password
          <input
            type="password"
            name="password"
            className="modalInput"
            autoComplete="current-password"
            required
          />
        </label>

        <input 
          type="submit" 
          value={loading ? "LOGGING IN..." : "LOG IN!"} 
          className="modalSubmit" 
          disabled={loading} 
        />
      </form>
    </Modal>
  )
}

export default Login

