import { useState } from "react"
import { useNavigate } from "react-router-dom"
import WaveText from "../components/Animations"
import "../css/Landing.css"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

function Landing() {
  const navigate = useNavigate()
  const [isSpinning, setIsSpinning] = useState(true)
  const [opened, { open, close }] = useDisclosure(false);

  const notes = [
    { icon: "♪", top: "30%", left: "40px", size: "32px", delay: "0s" },
    { icon: "♫", top: "45%", left: "10px", size: "48px", delay: "1.5s" },
    { icon: "♬", top: "30%", left: "30px", size: "36px", delay: "0.7s" },
    { icon: "♩", top: "65%", left: "0px", size: "40px", delay: "2.2s" },
    { icon: "♪", top: "80%", left: "50px", size: "28px", delay: "1.1s" },
  ]

  const handleCreateAccount = (e) => {
    e.preventDefault()
    // TODO: read form values / call API here  
    close()
    navigate('/home')
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
          <span style={{ textIndent: '50px' }}>listen to music.</span>
          <span style={{ textIndent: '50px' }}>rate it.</span>
          <span style={{ textIndent: '50px' }}>share it.</span>
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

          <form onSubmit={handleCreateAccount}>
            <label className="modalLabel">Email
              <input
                type="email"
                name="email"
                id="email"
                className="modalInput"
                required
              />
            </label>
            <label className="modalLabel">Username
              <input type="text" name="username" className="modalInput" required />
            </label>
            <label className="modalLabel">Password
              <input type="password" name="password" className="modalInput" required minLength={6} />
            </label>
            <input type="submit" value="SIGN UP!" className="modalSubmit" />
          </form>
        </Modal>

        <button className="start-btn" onClick={open}>
          GET STARTED!
        </button>
      </div>

      <div id="vinyl-container">
        {notes.map((note, index) => (
          <span
            key={index}
            className={`music-note ${isSpinning ? "floating" : ""}`}
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
        <div className={isSpinning ? "vinyl spin" : "vinyl"}></div>
      </div>
    </div>
  );
}
export default Landing;
