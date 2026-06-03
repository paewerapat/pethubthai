'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HERO_PETS = [
  { emoji: '🐕', size: 56, left: '4%',  top: '12%', dur: 7,   delay: 0,   dy: [-22, 10], dx: [6, -4] },
  { emoji: '🐈', size: 48, left: '87%', top: '8%',  dur: 8.5, delay: 1.3, dy: [-16, 12], dx: [-5, 7] },
  { emoji: '🐩', size: 40, left: '10%', top: '68%', dur: 9,   delay: 0.5, dy: [-14, 16], dx: [8, -6] },
  { emoji: '🐱', size: 50, left: '80%', top: '65%', dur: 6.5, delay: 2.1, dy: [-20, 8],  dx: [-4, 5] },
  { emoji: '🐾', size: 32, left: '47%', top: '4%',  dur: 10,  delay: 1.8, dy: [-10, 18], dx: [5, -8] },
  { emoji: '🦮', size: 60, left: '93%', top: '38%', dur: 7.5, delay: 0.8, dy: [-24, 6],  dx: [-6, 4] },
];

const LOGIN_PETS = [
  { emoji: '🐕', size: 44, left: '3%',  top: '10%', dur: 7,   delay: 0,   dy: [-18, 10], dx: [5, -4] },
  { emoji: '🐈', size: 38, left: '88%', top: '12%', dur: 8,   delay: 1,   dy: [-14, 12], dx: [-4, 6] },
  { emoji: '🐾', size: 28, left: '92%', top: '65%', dur: 9,   delay: 0.5, dy: [-10, 14], dx: [6, -5] },
  { emoji: '🐱', size: 42, left: '2%',  top: '70%', dur: 6.5, delay: 1.5, dy: [-16, 8],  dx: [-3, 5] },
];

type Variant = 'hero' | 'login';

interface Props {
  variant?: Variant;
}

export default function FloatingPets({ variant = 'hero' }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const pets = variant === 'login' ? LOGIN_PETS : HERO_PETS;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pets.map((p, i) => (
        <motion.span
          key={i}
          className="absolute select-none leading-none"
          style={{ left: p.left, top: p.top, fontSize: p.size }}
          animate={{
            opacity: [0.35, 0.55, 0.35, 0.45, 0.35],
            y: [0, p.dy[0], p.dy[1], p.dy[0] / 2, 0],
            x: [0, p.dx[0], p.dx[1], p.dx[0] / 2, 0],
            rotate: [0, 6, -5, 3, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
