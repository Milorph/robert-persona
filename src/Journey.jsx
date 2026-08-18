import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CHAPTERS = [
  {
    year: "2020",
    title: "THE BEGINNING",
    place: "Seattle University",
    line: "Began a BSc in Computer Science, building the foundation for everything that followed.",
    status: "Start",
  },
  {
    year: "2023",
    title: "THE AMAZON ARC",
    place: "Amazon, Seattle",
    line: "Built an internal self-service tool that reduced Alexa onboarding from days to minutes.",
    status: "Completed",
  },
  {
    year: "2024",
    title: "THE CLINIC ARC",
    place: "Bilimetrix USA",
    line: "Developed machine learning validation pipelines for clinical diagnostics, meeting 96% accuracy targets.",
    status: "Completed",
  },
  {
    year: "2025",
    title: "THE SCHOLAR ARC",
    place: "University of Victoria",
    line: "Pursued an MEng in Applied Data Science while teaching weekly labs for over 200 students.",
    status: "Completed",
  },
  {
    year: "2026",
    title: "THE CURRENT ARC",
    place: "Bombardier, Canada",
    line: "Building multidisciplinary design optimization tools for the Advanced Design team.",
    status: "Current",
  },
];

export default function Journey({ src }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(CHAPTERS.length - 1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive((i) => Math.min(CHAPTERS.length - 1, i + 1));
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div id="menu-screen">
      <video src={src} autoPlay loop muted playsInline />
      <style>{`
        .jr-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }
        .jr-tag {
          position: absolute;
          top: 5vh;
          left: 3vw;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 84px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          text-shadow:
            3px 3px 0 rgba(6, 15, 70, 0.9),
            -1px -1px 0 rgba(6, 15, 70, 0.55),
            0 0 26px rgba(2, 8, 40, 0.95);
          opacity: 0;
          transform: translateX(-24px) skewX(-6deg);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .jr-tag.mounted { opacity: 1; transform: translateX(0) skewX(-6deg); }
        .jr-tag span { color: #8df6ff; }

        .jr-stack {
          position: absolute;
          top: 22vh;
          left: 3vw;
          width: min(52vw, 760px);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .jr-card {
          position: relative;
          display: grid;
          grid-template-columns: 120px 1fr auto;
          align-items: center;
          gap: 16px;
          min-height: 78px;
          padding: 0 22px 0 0;
          background: rgba(8, 16, 68, 0.94);
          clip-path: polygon(0 0, 98% 0, 100% 100%, 2% 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.16), 0 8px 0 rgba(3, 8, 40, 0.7);
          cursor: pointer;
          pointer-events: all;
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.2s ease;
        }
        .jr-card.mounted { opacity: 1; transform: translateX(0); }
        .jr-card.active {
          background: #ffffff;
          box-shadow: 10px 8px 0 #2ea8d8;
          transform: translateX(10px);
        }
        .jr-year {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 44px;
          text-align: center;
          color: #8df6ff;
          background: rgba(4, 10, 50, 0.9);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          transition: color 0.2s ease, background 0.2s ease;
        }
        .jr-card.active .jr-year { background: #000; color: #fff; }
        .jr-main { display: flex; flex-direction: column; gap: 2px; }
        .jr-title {
          font-family: 'Anton', sans-serif;
          font-size: 30px;
          letter-spacing: 1px;
          color: #edfaff;
          transition: color 0.2s ease;
        }
        .jr-card.active .jr-title { color: #000; }
        .jr-place {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #7fd8ee;
          transition: color 0.2s ease;
        }
        .jr-card.active .jr-place { color: #2b6c8c; }
        .jr-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1.5px;
          color: #06133b;
          background: #8df6ff;
          padding: 7px 14px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .jr-card.active .jr-status { background: #000; color: #fff; }

        .jr-detail {
          position: absolute;
          top: 24vh;
          right: 4vw;
          width: min(34vw, 520px);
          z-index: 12;
          padding: 26px 28px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(133, 244, 255, 0.16), 16px 16px 0 rgba(0, 6, 30, 0.55);
        }
        .jr-detail-year {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 66px;
          line-height: 1;
          color: #8df6ff;
        }
        .jr-detail-title {
          font-family: 'Anton', sans-serif;
          font-size: 34px;
          letter-spacing: 1px;
          color: #f2fcff;
          margin: 6px 0 14px;
        }
        .jr-detail-line {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-style: italic;
          font-size: 24px;
          line-height: 1.3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #d9f6ff;
          transform: skewX(-3deg);
        }

        .jr-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 14;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .jr-footer.mounted { opacity: 1; }
        .jr-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.25);
        }
        .jr-footer-key {
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }

        /* ===== MOBILE ===== */
        @media (max-width: 820px) {
          .jr-overlay { position: relative; z-index: 3; height: auto; }
          .jr-tag {
            position: static;
            font-size: 46px;
            padding: 11vh 14px 6px;
            transform: skewX(-6deg);
          }
          .jr-stack {
            position: static;
            width: 100%;
            top: auto;
            left: auto;
            padding: 0 14px;
          }
          .jr-card { grid-template-columns: 82px 1fr auto; min-height: 62px; gap: 10px; }
          .jr-year { font-size: 32px; }
          .jr-title { font-size: 21px; }
          .jr-place { font-size: 14px; }
          .jr-status { font-size: 15px; padding: 5px 9px; }
          .jr-detail {
            position: static;
            width: auto;
            top: auto;
            right: auto;
            margin: 14px 14px 44px;
          }
          .jr-detail-year { font-size: 46px; }
          .jr-detail-title { font-size: 25px; }
          .jr-detail-line { font-size: 18px; }
          .jr-footer { display: none; }
        }
      `}</style>

      <div className="jr-overlay">
        <div className={`jr-tag${mounted ? " mounted" : ""}`}>MY <span>JOURNEY</span></div>
        <div className="jr-stack">
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.year}
              className={`jr-card${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: mounted ? `${i * 60}ms` : "0ms" }}
              onMouseMove={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <div className="jr-year">{ch.year}</div>
              <div className="jr-main">
                <div className="jr-title">{ch.title}</div>
                <div className="jr-place">{ch.place}</div>
              </div>
              <div className="jr-status">{ch.status}</div>
            </div>
          ))}
        </div>

        <div className="jr-detail" key={active}>
          <div className="jr-detail-year">{CHAPTERS[active].year}</div>
          <div className="jr-detail-title">{CHAPTERS[active].title}</div>
          <div className="jr-detail-line">{CHAPTERS[active].line}</div>
        </div>
      </div>

      <div className={`jr-footer${mounted ? " mounted" : ""}`}>
        <div className="jr-footer-row"><span className="jr-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="jr-footer-row"><span className="jr-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}
