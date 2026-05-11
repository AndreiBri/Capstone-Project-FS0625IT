import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";

const TextMonkeyFamily = ({
  children = "Monkey Family",
  className = "",
  colors = ["#1C0127", "#A06CD5", "#DABFFF", "#A06CD5"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;

    let p;
    if (yoyo) {
      const cycle = animationDuration * 2;
      const t = elapsedRef.current % cycle;
      p = t < animationDuration ? t / animationDuration : 2 - t / animationDuration;
    } else {
      p = (elapsedRef.current / animationDuration) % 1; // seamless loop
    }

    progress.set(p * 100);
  });

  // Reset when props change
  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, yoyo, progress]);

  const bgPos = useTransform(progress, (p) => {
    if (direction === "horizontal") return `${p}% 50%`;
    if (direction === "vertical") return `50% ${p}%`;
    return `${p}% ${p}%`; // diagonal
  });

  const gradientAngle = direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "135deg"; // diagonal

  // Duplicate first color for seamless loop
  const gradient = `linear-gradient(${gradientAngle}, ${[...colors, colors[0]].join(", ")})`;

  const handleMouseEnter = useCallback(() => pauseOnHover && setIsPaused(true), [pauseOnHover]);
  const handleMouseLeave = useCallback(() => pauseOnHover && setIsPaused(false), [pauseOnHover]);

  return (
    <div
      className={`relative inline-block max-w-fit cursor-pointer ${className}  hidden md:block`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Optional glowing border / background layer */}
      {showBorder && (
        <motion.div
          className="absolute inset-0 rounded-[1.25rem] -z-10 blur-sm opacity-70"
          style={{
            backgroundImage: gradient,
            backgroundSize: direction === "horizontal" ? "300% 100%" : "100% 300%",
            backgroundPositionX: bgPos, // or use bgPos directly if string
          }}
        />
      )}

      {/* The animated gradient text */}
      <motion.div
        className="bg-clip-text text-transparent font-bold tracking-tight py-2 hidden md:block"
        style={{
          backgroundImage: gradient,
          backgroundSize: direction === "horizontal" ? "300% 100%" : "100% 300%",
          backgroundPosition: bgPos,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default TextMonkeyFamily;
