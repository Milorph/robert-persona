import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import menuBg from './assets/p3menuflat.mp4'
import talkBg from './assets/main3.mp4'
import skillsBg from './assets/skillsbg.mp4'
import fuukaBg from './assets/fuuka1440.webm'
import bgm from './assets/bgm.mp3'
import P3Menu from './P3Menu'
import VideoPage from './VideoPage'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import Journey from './Journey'
import Talk from './Talk'
import './App.css'

function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = 0.35
    // Sound is off by default; the visitor turns it on with the toggle.
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <>
      <style>{`
        .bgm-toggle {
          position: fixed;
          bottom: 22px; left: 26px;
          z-index: 200;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 15px;
          letter-spacing: 2px;
          color: #fff;
          background: rgba(6, 12, 34, 0.72);
          border: 1px solid rgba(140, 239, 255, 0.45);
          padding: 7px 16px;
          cursor: pointer;
          transform: skewX(-10deg);
          transition: all 0.15s ease;
          user-select: none;
        }
        .bgm-toggle:hover {
          background: #8df6ff;
          color: #06133b;
          border-color: #8df6ff;
        }
        .bgm-toggle .bgm-state { color: #8df6ff; }
        .bgm-toggle:hover .bgm-state { color: #06133b; }
      `}</style>
      <audio ref={audioRef} src={bgm} loop />
      <button className="bgm-toggle" onClick={toggle}>
        SOUND <span className="bgm-state">{playing ? 'ON' : 'OFF'}</span>
      </button>
    </>
  )
}

function MenuScreen() {
  const navigate = useNavigate()
  const handleNavigate = (page) => {
    navigate(`/${page}`)
  }
  return (
    <div id="menu-screen">
      <video src={menuBg} autoPlay loop muted playsInline />
      <P3Menu onNavigate={handleNavigate} />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><MenuScreen /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><ResumePage src={skillsBg} /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        <Route path="/journey" element={
          <PageTransition variant="resume"><Journey src={fuukaBg} /></PageTransition>
        } />
        <Route path="/talk" element={
          <PageTransition variant="about"><Talk src={talkBg} /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

// Mobile-only navigation: a burger button (top-left) that opens a
// full-screen menu so touch users can jump between sections or go home,
// since there are no Esc/arrow keys on a phone. Hidden on desktop.
const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Me" },
  { path: "/resume", label: "Resume" },
  { path: "/socials", label: "Socials" },
  { path: "/journey", label: "Journey" },
  { path: "/talk", label: "Questions" },
]

function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname])

  // Landing page already shows the full menu, so no burger there.
  if (location.pathname === "/") return null

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <>
      <style>{`
        .mnav-burger { display: none; }
        @media (max-width: 820px) {
          .mnav-burger {
            display: flex;
            position: fixed;
            top: 12px; right: 12px;
            z-index: 500;
            width: 46px; height: 46px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            background: rgba(6, 12, 34, 0.82);
            border: 1px solid rgba(140, 239, 255, 0.5);
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 0 16px rgba(0, 168, 255, 0.3);
          }
          .mnav-burger span {
            display: block;
            width: 22px; height: 3px;
            background: #8df6ff;
            border-radius: 2px;
            transition: transform 0.2s ease, opacity 0.2s ease;
          }
          .mnav-burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
          .mnav-burger.open span:nth-child(2) { opacity: 0; }
          .mnav-burger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

          .mnav-overlay {
            position: fixed;
            inset: 0;
            z-index: 499;
            background: rgba(2, 8, 24, 0.92);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: mnav-fade 0.2s ease;
          }
          @keyframes mnav-fade { from { opacity: 0; } to { opacity: 1; } }
          .mnav-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
            width: 82%;
            max-width: 340px;
          }
          .mnav-item {
            font-family: 'Anton', sans-serif;
            font-style: italic;
            font-size: 30px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #cfeeff;
            background: rgba(10, 22, 68, 0.9);
            border: 0;
            border-left: 5px solid #8df6ff;
            text-align: left;
            padding: 14px 20px;
            cursor: pointer;
            transform: skewX(-8deg);
            clip-path: polygon(0 0, 100% 0, 97% 100%, 0 100%);
            transition: background 0.15s ease, color 0.15s ease;
          }
          .mnav-item:active { background: #8df6ff; color: #06133b; }
        }
      `}</style>
      <button
        className={`mnav-burger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span></span><span></span><span></span>
      </button>
      {open && (
        <div className="mnav-overlay" onClick={() => setOpen(false)}>
          <nav className="mnav-list" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((it) => (
              <button key={it.path} className="mnav-item" onClick={() => go(it.path)}>
                {it.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <>
      <MusicPlayer />
      <MobileNav />
      <AnimatedRoutes />
    </>
  )
}
