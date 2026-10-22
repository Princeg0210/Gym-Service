'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress({ color = '#ccff00' }: { color?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 35,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] origin-left pointer-events-none"
      style={{
        scaleX,
        backgroundColor: color
      }}
    />
  );
}

export default ScrollProgress;
