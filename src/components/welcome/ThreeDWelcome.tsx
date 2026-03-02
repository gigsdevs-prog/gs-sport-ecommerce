// ============================================
// GS SPORT - Premium 3D Welcome Intro
// Cinematic intro animation with Three.js
// ============================================

'use client';

import React, { useState, useEffect, useCallback, Suspense, lazy, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load Canvas AND Scene together to avoid partial failures
const Canvas = lazy(() =>
  import('@react-three/fiber').then((mod) => ({ default: mod.Canvas }))
);
const Scene3D = lazy(() =>
  import('./Scene3D').then((mod) => ({ default: mod.Scene }))
);

// ---- Error Boundary for 3D scene ----
class Welcome3DErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

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
  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  // Low-end device heuristics
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
  // Small memory devices
  if ((navigator as typeof navigator & { deviceMemory?: number }).deviceMemory && (navigator as typeof navigator & { deviceMemory?: number }).deviceMemory! < 4) return true;
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

export default function ThreeDWelcome() {
  const [show, setShow] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'text' | 'fadeout'>('loading');

  // Skip animation for returning visitors or low-end devices
  useEffect(() => {
    if (hasSeenIntro() || shouldSkipAnimation()) {
      setShow(false);
      return;
    }
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + (sceneReady ? 15 : 3);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [show, sceneReady]);

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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#fafafa] cursor-pointer select-none"
          onClick={handleSkip}
        >
          {/* 3D Canvas */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={
              phase !== 'loading'
                ? { opacity: phase === 'fadeout' ? 0 : 1, filter: 'blur(0px)' }
                : { opacity: 0.3, filter: 'blur(12px)' }
            }
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Welcome3DErrorBoundary onError={handleSkip}>
              <Suspense fallback={null}>
                <Canvas
                  camera={{ position: [0, 0.5, 5], fov: 35 }}
                  dpr={[1, 1.5]}
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                  }}
                  shadows={false}
                  onCreated={() => setSceneReady(true)}
                >
                  <Suspense fallback={null}>
                    <Scene3D />
                  </Suspense>
                </Canvas>
              </Suspense>
            </Welcome3DErrorBoundary>
          </motion.div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-28 md:pb-32 pointer-events-none">
            <motion.p
              className="text-[11px] md:text-[13px] tracking-[0.35em] uppercase text-neutral-800 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={
                phase === 'text' || phase === 'fadeout'
                  ? { opacity: phase === 'fadeout' ? 0 : 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 0, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
