import { useEffect, useRef } from "react";

// Plays the intro of the clip once, then loops only the calm middle
// section so the hard cut and white flash at the end never show.
export default function IntroLoopVideo({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    let raf;
    const tick = () => {
      if (v && v.duration && !Number.isNaN(v.duration)) {
        const loopStart = v.duration * 0.5;
        const loopEnd = v.duration - 0.45;
        if (v.currentTime >= loopEnd) v.currentTime = loopStart;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <video ref={ref} src={src} autoPlay muted playsInline />;
}

// Loops the clip but always skips the first `start` seconds,
// so an ugly opening (static, fade-in) never shows, even on wrap.
export function SkipLoopVideo({ src, start = 2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    const seek = () => { if (v.currentTime < start) v.currentTime = start; };
    v.addEventListener("loadedmetadata", seek);
    seek();
    let raf;
    const tick = () => {
      if (v && v.duration && !Number.isNaN(v.duration) && v.currentTime < start) {
        v.currentTime = start;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); v.removeEventListener("loadedmetadata", seek); };
  }, [start]);

  return <video ref={ref} src={src} autoPlay loop muted playsInline />;
}
