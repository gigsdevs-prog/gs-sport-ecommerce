// ============================================
// GS SPORT - Premium Welcome Intro
// Cinematic intro animation with Framer Motion
// Uses the GS logo with lightning bolt
// ============================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- Ease curve ----
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---- Loading Progress Bar ----
function LoadingIndicator({ progress }: { progress: number }) {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-48">
      <div className="h-[1px] bg-neutral-200 w-full rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-neutral-900"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 text-center mt-3">
        Loading
      </p>
    </div>
  );
}

// ---- Detect reduced motion & low perf ----
function shouldSkipAnimation(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
}

// ---- Check if intro was already shown ----
function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem('gs_intro_shown') === '1';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem('gs_intro_shown', '1');
  } catch {
    // Silent fail
  }
}

// ---- Animated GS Logo with actual logo image ----
function AnimatedLogo({ phase }: { phase: 'loading' | 'reveal' | 'text' | 'fadeout' }) {
  const isVisible = phase !== 'loading';
  const isFading = phase === 'fadeout';

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.85, opacity: 0, filter: 'blur(16px)' }}
      animate={
        isVisible
          ? {
              scale: isFading ? 1.08 : 1,
              opacity: isFading ? 0 : 1,
              filter: isFading ? 'blur(8px)' : 'blur(0px)',
            }
          : { scale: 0.85, opacity: 0.15, filter: 'blur(16px)' }
      }
      transition={{ duration: 1.2, ease: EASE_OUT }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="GS SPORT"
        className="w-48 md:w-64 lg:w-80 h-auto"
      />

      {/* Lightning flash overlay */}
      <motion.div
        className="absolute inset-0 bg-white rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={
          isVisible
            ? { opacity: [0, 0, 0.6, 0] }
            : { opacity: 0 }
        }
        transition={{
          duration: 0.8,
          delay: isVisible ? 0.3 : 0,
          times: [0, 0.1, 0.3, 1],
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}

export default function ThreeDWelcome() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'text' | 'fadeout'>('loading');

  // Skip animation for returning visitors or low-end devices
  useEffect(() => {
    if (hasSeenIntro() || shouldSkipAnimation()) {
      setShow(false);
      return;
    }
  }, []);

  // Loading progress
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Faster progress since no 3D to load
        return p + 8;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [show]);

  // Phase transitions
  useEffect(() => {
    if (!show) return;
    if (progress >= 100 && phase === 'loading') {
      setPhase('reveal');
      setTimeout(() => setPhase('text'), 800);
      setTimeout(() => setPhase('fadeout'), 3200);
      setTimeout(() => {
        setShow(false);
        markIntroSeen();
      }, 4000);
    }
  }, [progress, phase, show]);

  // Click to skip
  const handleSkip = useCallback(() => {
    setPhase('fadeout');
    setTimeout(() => {
      setShow(false);
      markIntroSeen();
    }, 600);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          className="fixed inset-0 z-[9999] bg-[#fafafa] cursor-pointer select-none"
          onClick={handleSkip}
        >
          {/* Subtle background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Centered Logo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedLogo phase={phase} />

            {/* SPORT text below logo */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl tracking-[0.5em] font-bold text-black mt-4 md:mt-6"
              initial={{ opacity: 0, y: 12 }}
              animate={
                phase === 'text' || phase === 'fadeout'
                  ? {
                      opacity: phase === 'fadeout' ? 0 : 1,
                      y: 0,
                    }
                  : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
            >
              SPORT
            </motion.p>
          </div>

          {/* Bottom text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-28 md:pb-32 pointer-events-none">
            <motion.p
              className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase text-neutral-800 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={
                phase === 'text' || phase === 'fadeout'
                  ? { opacity: phase === 'fadeout' ? 0 : 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0, ease: EASE_OUT }}
            >
              Welcome to GS Sport
            </motion.p>
            <motion.p
              className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-neutral-400 mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={
                phase === 'text' || phase === 'fadeout'
                  ? { opacity: phase === 'fadeout' ? 0 : 0.7, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
            >
              Performance · Minimalism · Power
            </motion.p>
          </div>

          {/* Loading Indicator */}
          {phase === 'loading' && <LoadingIndicator progress={progress} />}

          {/* Skip hint */}
          <motion.p
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] uppercase text-neutral-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'text' ? 0.5 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Click anywhere to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
