import { useState } from "react";

export default function TiltCard({ className, children, onClick }) {
  const [transform, setTransform] = useState("perspective(900px)");
  const [glow, setGlow] = useState(0);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTransform(
      `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateZ(6px)`
    );
    setGlow(Math.max(0, Math.min(1, 1 - Math.hypot(px - 0.5, py - 0.5) * 3)));
  };

  const reset = () => {
    setTransform("perspective(900px)");
    setGlow(0);
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={`relative transition-all duration-300 will-change-transform ${className || ""}`}
      style={{ transform, boxShadow: `0 0 ${glow * 20}px rgba(16, 185, 129, ${glow * 0.5})` }}
    >
      {children}
    </div>
  );
}