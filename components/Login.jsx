import { Modal } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

function Login({ opened, onClose }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const email = formData.get("email")
    const password = formData.get("password")
    const passwordInput = e.target.elements.password

    passwordInput.setCustomValidity("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      console.error("Login failed:", error)
      passwordInput.setCustomValidity(error.message)
      passwordInput.reportValidity()
      return
    }

    console.log("Logged in:", data)
    onClose()
    navigate("/home")
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

      <form onSubmit={handleLogin}>
        <label className="modalLabel">Email
          <input
            type="email"
            name="email"
            className="modalInput"
            autoComplete="email"
            required
          />
        </label>
        <label className="modalLabel">Password
          <input
            type="password"
            name="password"
            className="modalInput"
            autoComplete="current-password"
            required
          />
        </label>

        <input type="submit" value="LOG IN!" className="modalSubmit" disabled={loading} />
      </form>
    </Modal>
  )
}

export default Login
