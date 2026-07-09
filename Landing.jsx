import { useState } from "react"
import { useNavigate } from "react-router-dom"
import WaveText from "../components/Animations"
import "../css/Landing.css"
import vinyl from "../assets/vinyl.svg"

function Landing() {
  const navigate = useNavigate()
  const [isSpinning, setIsSpinning] = useState(true)
 const notes = [
  { icon: "♪", top: "30%", left: "40px", size: "32px", delay: "0s" },
  { icon: "♫", top: "45%", left: "10px", size: "48px", delay: "1.5s" },
  { icon: "♬", top: "30%", left: "30px", size: "36px", delay: "0.7s" },
  { icon: "♩", top: "65%", left: "0px", size: "40px", delay: "2.2s" },
  { icon: "♪", top: "80%", left: "50px", size: "28px", delay: "1.1s" },
]
  
  const onStart = () => {
    navigate("/home")
      }
    return (
        <div className="landing-container"> 
          <div className="landing-left">
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

              <button className="start-btn" onClick={onStart}>
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