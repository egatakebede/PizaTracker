// C:\Users\User\Desktop\pharmaa\src\components\MedicalParticles.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";

export default function MedicalParticles({ variant = "default" }) {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track window size for SSR safety
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const particles = useMemo(() => {
    const count = variant === "dashboard" ? 15 : 25;
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: 15 + Math.random() * 25,
      rot: Math.random() * 360,
      dur: 8 + Math.random() * 8,
      driftX: (Math.random() - 0.5) * 15,
      driftY: (Math.random() - 0.5) * 15,
      scale: 0.7 + Math.random() * 0.5,
      themeColor: Math.random(),
    }));
  }, [variant]);

  // Parallax effect
  const parallaxX = (mousePosition.x - windowSize.w / 2) / 40;
  const parallaxY = (mousePosition.y - windowSize.h / 2) / 40;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      animate={{ x: -parallaxX, y: -parallaxY }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    >
      {particles.map((p, i) => {
        const h = Math.max(10, p.w * 0.5);
        const grad =
          theme === "dark"
            ? p.themeColor < 0.5
              ? "linear-gradient(90deg,#10b981,#3b82f6)"
              : "linear-gradient(90deg,#22c55e,#10b981)"
            : p.themeColor < 0.5
            ? "linear-gradient(90deg,#81d4fa,#3b82f6)"
            : "linear-gradient(90deg,#a7f3d0,#10b981)";
        const opacity = variant === "dashboard" ? 0.2 : 0.35;

        return (
          <motion.div
            key={i}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: p.rot, scale: p.scale }}
            animate={{
              x: [`${p.x}vw`, `${p.x + p.driftX}vw`, `${p.x}vw`],
              y: [`${p.y}vh`, `${p.y + p.driftY}vh`, `${p.y}vh`],
              rotate: [p.rot, p.rot + 360],
              scale: [p.scale, p.scale + 0.1, p.scale],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
            className="absolute"
            style={{
              width: `${p.w}px`,
              height: `${h}px`,
              borderRadius: `${h}px`,
              background: grad,
              opacity,
              boxShadow:
                theme === "dark"
                  ? "0 2px 10px rgba(16,185,129,.25)"
                  : "0 2px 10px rgba(16,185,129,.15)",
            }}
          />
        );
      })}
    </motion.div>
  );
}
