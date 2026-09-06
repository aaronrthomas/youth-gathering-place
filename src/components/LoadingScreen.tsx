import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // Fade in → hold → fade out
    const hold = setTimeout(() => setPhase("hold"), 600);
    const out = setTimeout(() => setPhase("out"), 1800);
    return () => {
      clearTimeout(hold);
      clearTimeout(out);
    };
  }, []);

  return (
    <div
      className={`loading-screen ${phase === "out" ? "loading-screen--exit" : ""}`}
      aria-hidden="true"
    >
      {/* Radial background glow */}
      <div className="loading-glow" />

      {/* Animated cross */}
      <div className="loading-cross-wrap">
        {/* Vertical bar */}
        <div className="loading-cross-v" />
        {/* Horizontal bar */}
        <div className="loading-cross-h" />
        {/* Orbiting ring */}
        <div className="loading-ring" />
        {/* Sparks */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="loading-spark"
            style={{ "--spark-i": i } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div className="loading-wordmark">
        <p className="loading-place">St. Thomas Mar Thoma Parish · Pattor</p>
        <h1 className="loading-title">Yuvajana Sakhyam</h1>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
