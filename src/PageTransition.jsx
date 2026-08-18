import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const HALFTONE = "radial-gradient(circle, rgba(255,255,255,0.16) 1.6px, transparent 2px)";
const STAR =
  "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)";
const SLANT = "polygon(14% 0, 100% 0, 86% 100%, 0 100%)";

// Each tab owns a colour + motion; the same config is used going in AND out.
// each tab has a two-colour palette (panel + star) and a rich dark backdrop
const TABS = {
  "/about":   { color: "#7a1a6e", star: "#ff4fa0", dark: "#3a1140", motion: "slash", dir: "ltr" }, // purple + pink
  "/resume":  { color: "#0038d6", star: "#37c2ff", dark: "#0b1a5c", motion: "slash", dir: "rtl" }, // blue + cyan
  "/socials": { color: "#cc0a28", star: "#ffffff", dark: "#3d060e", motion: "drop" },              // crimson + white
  "/journey": { color: "#0a7a44", star: "#57f0a8", dark: "#083a24", motion: "slash", dir: "ltr" }, // green + mint
  "/talk":    { color: "#1a7bff", star: "#9af0ff", dark: "#0d2a66", motion: "dialogue" },          // azure + ice
};
const FALLBACK = TABS["/about"];

// remembers the previous route so leaving a tab reuses that tab's colour
let lastPath = "/";

const SLASH_TIMES = [0, 0.32, 0.62, 1];
const SLASH_EASE = [0.66, 0, 0.32, 1];
const DUR = 1.15; // slower, loading-screen pace

// Persona star in the tab's secondary colour, with a comic outline
function StarPop({ color }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "44vmax",
        height: "44vmax",
        marginLeft: "-22vmax",
        marginTop: "-22vmax",
        background: color,
        clipPath: STAR,
        filter:
          "drop-shadow(3px 3px 0 rgba(0,0,0,0.5)) drop-shadow(-2px -2px 0 rgba(255,255,255,0.55))",
        zIndex: 1000,
        pointerEvents: "none",
      }}
      initial={{ scale: 0, rotate: -55, opacity: 1 }}
      animate={{ scale: [0, 1.15, 1.15, 0], rotate: [-55, 20, 20, 120], opacity: [1, 1, 1, 0] }}
      transition={{ duration: 0.8, delay: 0.18, times: [0, 0.35, 0.62, 1], ease: [0.5, 0, 0.4, 1] }}
    />
  );
}

// full-cover halftone slash that sweeps in, holds, then sweeps out
function Sweep({ color, dir = "ltr", delay = 0, z, dur = DUR }) {
  const horiz = dir === "ltr" || dir === "rtl";
  const off = { ltr: "-165vw", rtl: "165vw", ttb: "-165vh", btt: "165vh" };
  const cov = { ltr: "-25vw", rtl: "25vw", ttb: "-25vh", btt: "25vh" };
  const out = { ltr: "165vw", rtl: "-165vw", ttb: "165vh", btt: "-165vh" };
  const key = horiz ? "x" : "y";
  return (
    <motion.div
      style={{
        position: "fixed",
        top: "-30vh",
        left: "-25vw",
        width: "150vw",
        height: "160vh",
        background: color,
        backgroundImage: HALFTONE,
        backgroundSize: "14px 14px",
        clipPath: horiz ? SLANT : "polygon(0 14%, 100% 0, 100% 86%, 0 100%)",
        zIndex: z,
        pointerEvents: "none",
      }}
      initial={{ [key]: off[dir] }}
      animate={{ [key]: [off[dir], cov[dir], cov[dir], out[dir]] }}
      transition={{ duration: dur, delay, times: SLASH_TIMES, ease: SLASH_EASE }}
    />
  );
}

function SlashTransition({ color, dir, star }) {
  return (
    <>
      <Sweep color={color} dir={dir} z={999} />
      <StarPop color={star} />
    </>
  );
}

// SOCIALS — vertical speed-line panel dropping down (matches the link bars)
function DropTransition({ color, star }) {
  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: "-30vh",
          left: "-25vw",
          width: "150vw",
          height: "160vh",
          background: color,
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.2) 0 3px, transparent 3px 24px)",
          clipPath: "polygon(0 14%, 100% 0, 100% 86%, 0 100%)",
          zIndex: 999,
          pointerEvents: "none",
        }}
        initial={{ y: "-165vh" }}
        animate={{ y: ["-165vh", "-25vh", "-25vh", "165vh"] }}
        transition={{ duration: DUR, times: SLASH_TIMES, ease: SLASH_EASE }}
      />
      <StarPop color={star} />
    </>
  );
}

// QUESTIONS — two dialogue panels clash in from opposite sides then part
function DialogueTransition({ color, star }) {
  const common = {
    position: "fixed",
    left: "-25vw",
    width: "150vw",
    height: "96vh",
    background: color,
    backgroundImage: HALFTONE,
    backgroundSize: "13px 13px",
    zIndex: 999,
    pointerEvents: "none",
  };
  return (
    <>
      <motion.div
        style={{ ...common, top: "-30vh", clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)" }}
        initial={{ x: "-170vw" }}
        animate={{ x: ["-170vw", "-25vw", "-25vw", "-170vw"] }}
        transition={{ duration: DUR, times: SLASH_TIMES, ease: SLASH_EASE }}
      />
      <motion.div
        style={{ ...common, top: "34vh", clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)" }}
        initial={{ x: "170vw" }}
        animate={{ x: ["170vw", "25vw", "25vw", "170vw"] }}
        transition={{ duration: DUR, delay: 0.12, times: SLASH_TIMES, ease: SLASH_EASE }}
      />
      <StarPop color={star} />
    </>
  );
}

// textured dark backdrop so the slashed-out region shows halftone + speed
// lines (tinted to the tab colour) instead of flat black
function Backdrop({ color }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: color,
        backgroundImage: `${HALFTONE}, repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 26px)`,
        backgroundSize: "14px 14px, auto",
        zIndex: 997,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: DUR, times: [0, 0.13, 0.82, 1], ease: "linear" }}
    />
  );
}

function TransitionOverlay({ config }) {
  return (
    <>
      <Backdrop color={config.dark} />
      {config.motion === "drop" ? (
        <DropTransition color={config.color} star={config.star} />
      ) : config.motion === "dialogue" ? (
        <DialogueTransition color={config.color} star={config.star} />
      ) : (
        <SlashTransition color={config.color} dir={config.dir} star={config.star} />
      )}
    </>
  );
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const path = location.pathname;
  // entering a tab uses that tab's config; returning to the menu reuses the
  // config of the tab we just left, so in and out share the same colour.
  const active = TABS[path] ? path : TABS[lastPath] ? lastPath : null;
  const config = (active && TABS[active]) || FALLBACK;

  useEffect(() => {
    lastPath = path;
  }, [path]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={path} style={{ position: "relative" }}>
        <TransitionOverlay config={config} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
