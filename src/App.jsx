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
    audio.volume = 0.35
    const start = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {})
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    audio.play().then(() => setPlaying(true)).catch(() => {
      window.addEventListener('pointerdown', start)
      window.addEventListener('keydown', start)
    })
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
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
    if (page === 'github') {
      window.open('https://github.com/Milorph', '_blank')
    } else {
      navigate(`/${page}`)
    }
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

export default function App() {
  return (
    <>
      <MusicPlayer />
      <AnimatedRoutes />
    </>
  )
}
