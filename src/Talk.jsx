import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import spriteNeutral from "./assets/aki_neutral.png";
import spriteHappy from "./assets/aki_happy.png";
import spriteExcited from "./assets/aki_excited.png";
import spriteProud from "./assets/aki_proud.png";
import spriteThink from "./assets/aki_think.png";
import spriteDetermined from "./assets/aki_determined.png";
import spriteGrimace from "./assets/aki_grimace.png";

const SPRITES = {
  neutral: spriteNeutral,
  happy: spriteHappy,
  excited: spriteExcited,
  proud: spriteProud,
  think: spriteThink,
  determined: spriteDetermined,
  grimace: spriteGrimace,
};

const GREETING = {
  emotion: "neutral",
  text: "Hey! You actually clicked! Welcome to my corner of the Dark Hour. Pick a question and I will answer honestly. Probably!",
};

const QUESTIONS = [
  {
    q: "Who are you?",
    emotion: "happy",
    a: "Robert Winston Widjaja! Software developer at Bombardier by day, machine learning enjoyer at all hours! I build the tools that help design actual aircraft. How cool is that!",
  },
  {
    q: "What are you focused on right now?",
    emotion: "determined",
    a: "Machine learning is the main quest! I am aiming for data scientist and software engineer roles, whichever boss fight comes first. My MDO tooling work at Bombardier levels up both!",
  },
  {
    q: "What is your proudest project?",
    emotion: "proud",
    a: "My RAG fact-checking pipeline! Four stages, fine-tuned cross-encoders, 89.1% FEVER accuracy! PM-LSH straight from a research paper is a close second. Check the Resume tab!",
  },
  {
    q: "Are you open to opportunities?",
    emotion: "excited",
    a: "Always! Data scientist or software engineer, bring it on! Head to the Socials tab and send an email or a LinkedIn message. I reply fast!",
  },
  {
    q: "What do you do for fun?",
    emotion: "grimace",
    a: "Clearly I build Persona-themed websites! Also the gym, gaming, and reimplementing algorithms from papers, because apparently that is my idea of relaxing!",
  },
  {
    q: "Any advice for future teammates?",
    emotion: "think",
    a: "Write tests! And name your variables like a stranger will read them, because a stranger will. Usually it is you, three months later, very confused!",
  },
];

const BALLOONS = {
  excited: "!",
  determined: "!!",
  proud: "star",
  happy: "heart",
  think: "...",
  grimace: "drop",
  neutral: null,
};

export default function Talk({ src }) {
  const navigate = useNavigate();
  const [sel, setSel] = useState(0);
  const [current, setCurrent] = useState(GREETING);
  const [shown, setShown] = useState("");
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // typewriter
  useEffect(() => {
    clearInterval(timer.current);
    setShown("");
    let i = 0;
    timer.current = setInterval(() => {
      i += 2;
      setShown(current.text.slice(0, i));
      if (i >= current.text.length) clearInterval(timer.current);
    }, 18);
    return () => clearInterval(timer.current);
  }, [current]);

  const ask = (idx) => {
    setSel(idx);
    setCurrent({ emotion: QUESTIONS[idx].emotion, text: QUESTIONS[idx].a });
    setPulse((p) => p + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setSel((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setSel((i) => Math.min(QUESTIONS.length - 1, i + 1));
      if (e.key === "Enter") ask(sel);
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, navigate]);

  const balloon = BALLOONS[current.emotion];

  return (
    <div id="menu-screen">
      <video src={src} autoPlay loop muted playsInline style={{ filter: "brightness(0.45) saturate(1.1)" }} />
      <style>{`
        .tk-overlay { position: absolute; inset: 0; z-index: 10; overflow: hidden; }

        .tk-tag {
          position: absolute;
          top: 5vh; left: 3vw;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 76px;
          color: #f6fbff;
          letter-spacing: 2px;
          transform: skewX(-6deg);
          text-shadow: 3px 3px 0 rgba(6,15,70,0.9), -1px -1px 0 rgba(6,15,70,0.55), 0 0 26px rgba(2,8,40,0.95);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .tk-tag.mounted { opacity: 1; }
        .tk-tag span { color: #8df6ff; }

        /* ---- sprite ---- */
        .tk-sprite-wrap {
          position: absolute;
          right: 7vw;
          bottom: 0;
          height: 66vh;
          width: 32vw;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          pointer-events: none;
          z-index: 11;
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .tk-sprite-wrap.mounted { opacity: 1; transform: translateX(0); }
        .tk-sprite {
          max-height: 100%;
          max-width: 100%;
          filter: drop-shadow(0 0 34px rgba(80, 170, 255, 0.4)) drop-shadow(0 6px 14px rgba(0,0,0,0.5));
          transition: opacity 0.12s ease;
        }
        .tk-sprite-wrap.neutral .tk-sprite    { animation: tk-bob 4s ease-in-out infinite; }
        .tk-sprite-wrap.happy .tk-sprite      { animation: tk-sway 2.2s ease-in-out infinite; }
        .tk-sprite-wrap.excited .tk-sprite    { animation: tk-hop 0.55s cubic-bezier(0.34,1.56,0.64,1) 2; }
        .tk-sprite-wrap.proud .tk-sprite      { animation: tk-proud 0.9s cubic-bezier(0.22,1,0.36,1) 1 forwards; }
        .tk-sprite-wrap.think .tk-sprite      { animation: tk-think 3s ease-in-out infinite; }
        .tk-sprite-wrap.determined .tk-sprite { animation: tk-stomp 0.5s cubic-bezier(0.34,1.56,0.64,1) 1 forwards; }
        .tk-sprite-wrap.grimace .tk-sprite    { animation: tk-wobble 0.7s ease-in-out 2; }
        @keyframes tk-stomp  { 0% { transform: translateY(-20px) scale(1.04); } 60% { transform: translateY(4px) scale(0.99); } 100% { transform: translateY(0) scale(1.02); } }
        @keyframes tk-wobble { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-2.4deg); } 75% { transform: rotate(2.4deg); } }

        @keyframes tk-bob   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes tk-sway  { 0%,100% { transform: rotate(-1.4deg) translateY(0); } 50% { transform: rotate(1.4deg) translateY(-8px); } }
        @keyframes tk-hop   { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-34px) scale(1.02); } }
        @keyframes tk-proud { 0% { transform: scale(1); } 45% { transform: scale(1.07) translateY(-12px); } 100% { transform: scale(1.03) translateY(-6px); } }
        @keyframes tk-think { 0%,100% { transform: rotate(1.6deg) translateY(2px); } 50% { transform: rotate(0.4deg) translateY(6px); } }

        /* ---- emotion balloon ---- */
        .tk-balloon {
          position: absolute;
          top: 4vh;
          right: 6vw;
          width: 84px;
          height: 84px;
          background: #ffffff;
          border: 4px solid #0a1a5c;
          clip-path: polygon(8% 0, 100% 4%, 94% 88%, 55% 92%, 40% 100%, 38% 90%, 0 94%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 12;
          animation: tk-balloon-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes tk-balloon-pop {
          0% { transform: scale(0) rotate(-14deg); }
          70% { transform: scale(1.15) rotate(4deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .tk-balloon-glyph {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          color: #d92637;
          transform: skewX(-8deg);
          line-height: 1;
        }
        .tk-shape-heart {
          width: 40px; height: 38px;
          background: #ff3860;
          clip-path: path('M20 36 C4 24 0 14 6 7 C11 1 19 3 20 10 C21 3 29 1 34 7 C40 14 36 24 20 36 Z');
        }
        .tk-shape-star {
          width: 44px; height: 44px;
          background: #ffc400;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        .tk-shape-drop {
          width: 26px; height: 38px;
          background: #4aa8ff;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          clip-path: polygon(50% 0%, 100% 55%, 88% 90%, 50% 100%, 12% 90%, 0% 55%);
        }

        /* ---- questions ---- */
        .tk-questions {
          position: absolute;
          top: 18vh;
          left: 3vw;
          width: min(44vw, 640px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 12;
        }
        .tk-q {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-style: italic;
          font-size: 24px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #cfeeff;
          background: rgba(8, 16, 68, 0.9);
          border: 0;
          text-align: left;
          padding: 12px 22px;
          cursor: pointer;
          clip-path: polygon(0 0, 98% 0, 100% 100%, 2% 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.18);
          transform: skewX(-6deg) translateX(-40px);
          opacity: 0;
          transition: all 0.2s ease;
          pointer-events: all;
        }
        .tk-q.mounted { opacity: 1; transform: skewX(-6deg) translateX(0); }
        .tk-q.sel {
          background: #ffffff;
          color: #06133b;
          box-shadow: 8px 6px 0 #2ea8d8;
          transform: skewX(-6deg) translateX(12px) scale(1.02);
        }
        .tk-q.sel::before { content: "▶ "; color: #d92637; }

        /* ---- dialogue box ---- */
        .tk-dialog {
          position: absolute;
          left: 3vw;
          bottom: 5vh;
          width: min(58vw, 900px);
          min-height: 148px;
          z-index: 13;
          background: rgba(4, 8, 26, 0.92);
          border: 3px solid rgba(255, 255, 255, 0.9);
          border-radius: 26px 26px 26px 4px;
          padding: 40px 30px 24px 30px;
          box-shadow: 0 0 0 3px rgba(4, 8, 26, 0.6), 0 14px 40px rgba(0, 0, 0, 0.55);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.4s ease 0.15s, transform 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s;
        }
        .tk-dialog.mounted { opacity: 1; transform: translateY(0); }
        .tk-dialog-name {
          position: absolute;
          top: -22px;
          left: 22px;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 26px;
          letter-spacing: 2px;
          color: #ffffff;
          background: linear-gradient(100deg, #0d2d8a, #1a6aff);
          padding: 5px 22px;
          clip-path: polygon(4% 0, 100% 8%, 96% 100%, 0 92%);
          box-shadow: 0 0 14px rgba(26, 106, 255, 0.55);
        }
        .tk-dialog-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-style: italic;
          font-size: 27px;
          line-height: 1.35;
          letter-spacing: 0.5px;
          color: #f2fcff;
          min-height: 74px;
        }
        .tk-dialog-caret {
          display: inline-block;
          width: 0; height: 0;
          margin-left: 8px;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-top: 12px solid #8df6ff;
          animation: tk-caret 0.8s ease-in-out infinite;
          vertical-align: baseline;
        }
        @keyframes tk-caret { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

        .tk-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 14;
        }
        .tk-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
        }
        .tk-footer-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }
      `}</style>

      <div className="tk-overlay">
        <div className={`tk-tag${mounted ? " mounted" : ""}`}>TALK TO <span>ME</span></div>

        <div className="tk-questions">
          {QUESTIONS.map((item, i) => (
            <button
              key={item.q}
              className={`tk-q${sel === i ? " sel" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: mounted ? `${i * 55}ms` : "0ms" }}
              onMouseMove={() => setSel(i)}
              onClick={() => ask(i)}
            >
              {item.q}
            </button>
          ))}
        </div>

        <div className={`tk-sprite-wrap ${current.emotion}${mounted ? " mounted" : ""}`} key={`sprite-${pulse}`}>
          <img className="tk-sprite" src={SPRITES[current.emotion] ?? spriteNeutral} alt="" />
        </div>

        {balloon && (
          <div className="tk-balloon" key={`balloon-${pulse}`}>
            {balloon === "heart" && <div className="tk-shape-heart" />}
            {balloon === "star" && <div className="tk-shape-star" />}
            {balloon === "drop" && <div className="tk-shape-drop" />}
            {balloon !== "heart" && balloon !== "star" && balloon !== "drop" && (
              <div className="tk-balloon-glyph">{balloon}</div>
            )}
          </div>
        )}

        <div className={`tk-dialog${mounted ? " mounted" : ""}`}>
          <div className="tk-dialog-name">ROBERT</div>
          <div className="tk-dialog-text">
            {shown}
            {shown.length >= current.text.length && <span className="tk-dialog-caret" />}
          </div>
        </div>
      </div>

      <div className="tk-footer">
        <div className="tk-footer-row"><span className="tk-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="tk-footer-row"><span className="tk-footer-key">↵</span><span>ASK</span></div>
        <div className="tk-footer-row"><span className="tk-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}
