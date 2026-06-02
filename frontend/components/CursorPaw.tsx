'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorPaw() {
  const [mounted, setMounted] = useState(false);
  const [isFine, setIsFine] = useState(false);
  const [pressing, setPressing] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { stiffness: 700, damping: 40, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 700, damping: 40, mass: 0.4 });

  useEffect(() => {
    setMounted(true);
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsFine(fine);
    if (!fine) return;

    const onMove = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY); };
    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [rawX, rawY]);

  if (!mounted || !isFine) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        scale: pressing ? 0.65 : 1,
        rotate: pressing ? 18 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        {/* Main central pad */}
        <ellipse cx="18" cy="24" rx="9" ry="8" fill="#ff9ec7" />
        {/* Three toe pads */}
        <ellipse cx="9.5"  cy="14" rx="4"   ry="3.5" fill="#ff9ec7" />
        <ellipse cx="18"   cy="11" rx="4"   ry="3.5" fill="#ff9ec7" />
        <ellipse cx="26.5" cy="14" rx="4"   ry="3.5" fill="#ff9ec7" />
        {/* Small thumb pad */}
        <ellipse cx="6"   cy="21" rx="2.8" ry="2.4" fill="#ff9ec7" />
        {/* Outlines */}
        <ellipse cx="18" cy="24" rx="9" ry="8" fill="none" stroke="#e685b3" strokeWidth="0.8" />
        <ellipse cx="9.5"  cy="14" rx="4"   ry="3.5" fill="none" stroke="#e685b3" strokeWidth="0.8" />
        <ellipse cx="18"   cy="11" rx="4"   ry="3.5" fill="none" stroke="#e685b3" strokeWidth="0.8" />
        <ellipse cx="26.5" cy="14" rx="4"   ry="3.5" fill="none" stroke="#e685b3" strokeWidth="0.8" />
        <ellipse cx="6"   cy="21" rx="2.8" ry="2.4" fill="none" stroke="#e685b3" strokeWidth="0.8" />
      </svg>
    </motion.div>
  );
}
