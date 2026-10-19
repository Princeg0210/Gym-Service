'use client';

import React, { useEffect, useRef } from 'react';

export interface ParticleDriftProps {
  /** Accent color for particles and glow (hex or rgba, e.g. '#ccff00') */
  color?: string;
  /** Number of particles on desktop (automatically halved on mobile) */
  particleCount?: number;
  /** Max distance between particles to draw constellation links */
  connectionDistance?: number;
  /** Multiplier for how strongly scrolling accelerates the particles */
  scrollSensitivity?: number;
  /** Radius around mouse pointer where particles react */
  mouseRadius?: number;
  /** Extra CSS classes */
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  depth: number; // 0.3 (far) to 1.2 (near) for parallax depth
}

/**
 * OriginKit Particle Drift Component
 *
 * High-performance WebGL/2D canvas field of drifting particles that reacts dynamically
 * to page scrolling (up/down momentum), draws fading constellation links, and lights up
 * under pointer interaction.
 */
export function ParticleDrift({
  color = '#ccff00',
  particleCount = 85,
  connectionDistance = 110,
  scrollSensitivity = 0.35,
  mouseRadius = 130,
  className = '',
}: ParticleDriftProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Parse color to RGB for rgba strings
    const hexToRgb = (hex: string) => {
      const sanitized = hex.replace('#', '');
      if (sanitized.length === 3) {
        return {
          r: parseInt(sanitized[0] + sanitized[0], 16),
          g: parseInt(sanitized[1] + sanitized[1], 16),
          b: parseInt(sanitized[2] + sanitized[2], 16),
        };
      }
      if (sanitized.length === 6) {
        return {
          r: parseInt(sanitized.substring(0, 2), 16),
          g: parseInt(sanitized.substring(2, 4), 16),
          b: parseInt(sanitized.substring(4, 6), 16),
        };
      }
      return { r: 204, g: 255, b: 0 }; // fallback electric lime
    };

    const rgb = hexToRgb(color);

    // Track scroll velocity with smooth damping
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;

    // Track mouse position
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.floor(particleCount * 0.45) : particleCount;
    const particles: Particle[] = [];

    // Initialize particles across full viewport
    for (let i = 0; i < actualCount; i++) {
      const depth = Math.random() * 0.9 + 0.3; // 0.3 to 1.2
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * 0.35 * depth,
        baseVy: (Math.random() * 0.3 + 0.15) * depth, // subtle natural upward drift
        vx: 0,
        vy: 0,
        radius: (Math.random() * 1.5 + 0.7) * depth,
        baseAlpha: Math.random() * 0.45 + 0.25,
        alpha: Math.random() * 0.45 + 0.25,
        depth,
      });
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();

    // Scroll listener: calculate directional scroll impulse
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Scrolling down -> delta > 0 -> particles stream up (negative vy)
      // Scrolling up -> delta < 0 -> particles stream down (positive vy)
      targetScrollVelocity = -delta * scrollSensitivity;

      // Clamp max velocity to keep visual elegance
      if (targetScrollVelocity > 25) targetScrollVelocity = 25;
      if (targetScrollVelocity < -25) targetScrollVelocity = -25;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Render loop
    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastScrollY = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const maxDistSq = connectionDistance * connectionDistance;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate scroll velocity with damping
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.08;
      targetScrollVelocity *= 0.92; // smooth decay when scrolling stops

      // Update and draw particles
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Apply scroll momentum multiplied by depth (closer particles shift faster)
        p.vy = p.baseVy + scrollVelocity * p.depth;
        p.vx = p.baseVx;

        // Mouse proximity reaction: gentle illumination and magnetic nudge
        let mouseInfluence = 0;
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < mouseRadiusSq) {
            const mDist = Math.sqrt(mDistSq);
            mouseInfluence = 1 - mDist / mouseRadius;
            // Subtle repel away from cursor
            const force = (1 - mDist / mouseRadius) * 0.8;
            p.vx += (mdx / (mDist || 1)) * force;
            p.vy += (mdy / (mDist || 1)) * force;
          }
        }

        // Advance position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Particle opacity boosted by cursor proximity
        p.alpha = Math.min(1, p.baseAlpha + mouseInfluence * 0.5);

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + mouseInfluence * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        ctx.fill();

        // Optional subtle glow for near particles
        if (p.depth > 0.85 && p.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha * 0.15})`;
          ctx.fill();
        }

        // Draw constellation connections between close particles
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connectionDistance) * 0.14 * ((p.depth + p2.depth) / 2);

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [color, particleCount, connectionDistance, scrollSensitivity, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

export default ParticleDrift;
