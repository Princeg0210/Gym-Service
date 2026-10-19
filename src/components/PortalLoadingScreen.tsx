'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Dumbbell, LayoutGrid, Loader2, CheckCircle2 } from 'lucide-react';
import MetalLapJoint from '@/components/originkit/metal-lap-joint';

interface PortalInfo {
  name: string;
  badge: string;
  path: string;
  icon: 'admin' | 'member' | 'showcase';
  subtitle: string;
  steps: string[];
}

const PORTALS_CONFIG: Record<string, PortalInfo> = {
  '/admin': {
    name: 'Admin Operations Console',
    badge: 'STAFF & MANAGEMENT',
    path: '/admin',
    icon: 'admin',
    subtitle: 'Connecting real-time reception desk, UPI dues & equipment monitors',
    steps: [
      'Verifying administrative credentials & session...',
      'Connecting to Supabase RLS database...',
      'Loading attendance ledger and member roster...',
      'Preparing Operations Desk interface...'
    ]
  },
  '/member': {
    name: 'Athlete Member Portal',
    badge: 'ATHLETE ARENA',
    path: '/member',
    icon: 'member',
    subtitle: 'Loading personalized workout routines, diet charts & digital pass',
    steps: [
      'Authenticating athlete profile...',
      'Retrieving exercise database & progression tracking...',
      'Calculating macronutrient targets & nutrition plans...',
      'Preparing athlete workout arena...'
    ]
  },
  '/': {
    name: 'GymPRO Commercial Showcase',
    badge: 'COMMERCIAL SHOWCASE',
    path: '/',
    icon: 'showcase',
    subtitle: 'Loading interactive gym operating demo, metrics & reception scanner',
    steps: [
      'Initializing GymPRO commercial ecosystem...',
      'Preparing live reception desk & WhatsApp simulator...',
      'Mounting commercial club showcase...'
    ]
  }
};

interface PortalLoadingContextType {
  isNavigating: boolean;
  targetPortal: PortalInfo | null;
  openPortal: (path: string, customOptions?: Partial<PortalInfo>) => void;
  notifyPageReady: (pagePath?: string) => void;
}

const PortalLoadingContext = createContext<PortalLoadingContextType>({
  isNavigating: false,
  targetPortal: null,
  openPortal: () => {},
  notifyPageReady: () => {}
});

export function usePortalLoading() {
  return useContext(PortalLoadingContext);
}

export function PortalLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [isNavigating, setIsNavigating] = useState(true);
  const [targetPortal, setTargetPortal] = useState<PortalInfo | null>(() => {
    const normalized = pathname?.split('?')[0].split('#')[0] || '/';
    return PORTALS_CONFIG[normalized] || PORTALS_CONFIG['/'];
  });
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const targetPathRef = useRef<string | null>(pathname || '/');
  const navigationStartTimeRef = useRef<number>(Date.now());
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync client start time on initial mount to guarantee accurate 4-second timing
  useEffect(() => {
    navigationStartTimeRef.current = Date.now();
  }, []);

  const openPortal = useCallback(
    (path: string, customOptions?: Partial<PortalInfo>) => {
      const normalizedPath = path.split('?')[0].split('#')[0] || '/';
      if (normalizedPath === pathname && !isNavigating) return;

      const portalConfig =
        PORTALS_CONFIG[normalizedPath] || {
          name: customOptions?.name || 'Loading Portal',
          badge: customOptions?.badge || 'GYMPRO SYSTEM',
          path: normalizedPath,
          icon: (normalizedPath.includes('admin')
            ? 'admin'
            : normalizedPath.includes('member')
            ? 'member'
            : 'showcase') as PortalInfo['icon'],
          subtitle: customOptions?.subtitle || 'Transitioning to requested portal...',
          steps: [
            'Initializing portal environment...',
            'Authenticating security credentials...',
            'Synchronizing offline & live data...',
            'Opening interface...'
          ]
        };

      targetPathRef.current = normalizedPath;
      navigationStartTimeRef.current = Date.now();
      setTargetPortal({ ...portalConfig, ...customOptions });
      setIsNavigating(true);
      setIsFinishing(false);
      setProgress(0);
      setStepIndex(0);

      // Start route push
      startTransition(() => {
        router.push(path);
      });

      // Clear any prior finish timeouts
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    },
    [pathname, router, isNavigating]
  );

  const notifyPageReady = useCallback((pagePath?: string) => {
    // If a specific path was passed and doesn't match our target, ignore
    if (pagePath && targetPathRef.current && targetPathRef.current !== pagePath) {
      return;
    }
    // Handled by the elapsed 4-second timeline loop to guarantee full 4s duration
  }, []);

  // Exact 4-Second (4000ms) Progress & Kinematic Step Controller
  useEffect(() => {
    if (!isNavigating || isFinishing) return;

    const DURATION_MS = 4000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - navigationStartTimeRef.current;

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        setProgress(100);
        setIsFinishing(true);

        finishTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
          setTargetPortal(null);
          setIsFinishing(false);
          setProgress(0);
          setStepIndex(0);
          targetPathRef.current = null;
        }, 350);
        return;
      }

      // Smooth progress from 0% to 99% until 4000ms completes
      const calculatedProgress = Math.min(99, Math.floor((elapsed / DURATION_MS) * 100));
      setProgress(calculatedProgress);

      // Rotate through steps across the 4-second period
      const steps = targetPortal?.steps || PORTALS_CONFIG['/'].steps;
      const calculatedStep = Math.min(
        steps.length - 1,
        Math.floor((elapsed / DURATION_MS) * steps.length)
      );
      setStepIndex(calculatedStep);
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [isNavigating, isFinishing, targetPortal]);

  // Delegated click handler to intercept clicks on internal portal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const isPortalRoute = href === '/admin' || href === '/member' || href === '/';
      if (!isPortalRoute) return;

      const currentPath = window.location.pathname;
      if (href === currentPath) return;

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      openPortal(href);
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [openPortal]);

  return (
    <PortalLoadingContext.Provider value={{ isNavigating, targetPortal, openPortal, notifyPageReady }}>
      {children}
      <AnimatePresence>
        {isNavigating && targetPortal && (
          <PortalLoadingOverlay
            portal={targetPortal}
            progress={progress}
            stepIndex={stepIndex}
            isFinishing={isFinishing}
          />
        )}
      </AnimatePresence>
    </PortalLoadingContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// The Fullscreen Premium Loading Overlay Component
// ─────────────────────────────────────────────────────────────

interface PortalLoadingOverlayProps {
  portal: PortalInfo;
  progress: number;
  stepIndex: number;
  isFinishing?: boolean;
}

export function PortalLoadingOverlay({
  portal,
  progress,
  stepIndex,
  isFinishing
}: PortalLoadingOverlayProps) {
  const currentStep = isFinishing
    ? 'Portal ready — Opening screen now...'
    : portal.steps[Math.min(stepIndex, portal.steps.length - 1)] || portal.steps[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060709]/96 backdrop-blur-xl px-4 text-center select-none"
    >
      {/* Dynamic Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ccff00]/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[#1e2738]/50 blur-[90px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-black tracking-tight text-white text-xl">
            Gym<span className="text-[#ccff00]">PRO</span>
          </span>
          <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#ccff00]">
            {portal.badge}
          </span>
        </div>

        {/* OriginKit 3D Kinetic Dumbbell Lap Joint Loading Animation */}
        <div className="relative flex items-center justify-center my-3 w-52 h-52 sm:w-60 sm:h-60">
          <div className="absolute inset-0 rounded-full bg-[#ccff00]/10 blur-2xl pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <MetalLapJoint
              variant="dumbbell"
              baseColor="#ccff00"
              speed={52}
              distance={25}
              material={{ roughness: 42, reflect: 82 }}
              motion={{ spin: 20, fold: 90, hold: 28 }}
              camera={{ tilt: 30, sideTilt: 0 }}
              background="transparent"
            />
          </div>
        </div>

        {/* Portal Title & Subtitle */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-extrabold text-white tracking-tight"
        >
          {portal.name}
        </motion.h3>

        <p className="mt-1.5 text-xs text-zinc-400 font-medium px-4 leading-relaxed">
          {portal.subtitle}
        </p>

        {/* Dynamic Progress Bar */}
        <div className="w-full mt-6 bg-[#121620] border border-[#1e2433] rounded-full h-2.5 p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#99cc00] via-[#ccff00] to-[#e6ff80] shadow-sm"
            initial={{ width: '15%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Percentage & Step Status */}
        <div className="flex items-center justify-between w-full mt-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            {isFinishing ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00]" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ccff00]" />
            )}
            <span className="font-mono text-zinc-300">{currentStep}</span>
          </div>
          <span className="font-mono font-bold text-[#ccff00]">{progress}%</span>
        </div>

        {/* Security & Reliability Badge */}
        <div className="mt-6 flex items-center gap-1.5 rounded-full border border-[#1e2638] bg-[#0c1017] px-3 py-1 text-xs text-zinc-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00]" />
          <span>High-Velocity Offline-Resilient Engine</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Standalone Route Loading Screen (for loading.tsx files)
// ─────────────────────────────────────────────────────────────

export function RouteLoadingScreen({
  title = 'GymPRO Portal',
  subtitle = 'Synchronizing real-time attendance, roster & biometric data...',
  badge = 'LOADING PORTAL',
  icon = 'showcase',
  duration = 4000
}: {
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: 'admin' | 'member' | 'showcase';
  duration?: number;
}) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const steps = [
    'Initializing 3D kinetic floor & equipment...',
    'Synchronizing member attendance & roster...',
    'Verifying biometric checkpoints & access...',
    'Finalizing interface — Welcome to GymPRO'
  ];

  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= duration) {
        setProgress(100);
        setStepIndex(steps.length - 1);
        clearInterval(interval);
        return;
      }
      setProgress(Math.min(99, Math.floor((elapsed / duration) * 100)));
      setStepIndex(Math.min(steps.length - 1, Math.floor((elapsed / duration) * steps.length)));
    }, 40);

    return () => clearInterval(interval);
  }, [duration, steps.length]);

  const currentStep = progress >= 100
    ? 'Portal ready — Opening screen now...'
    : steps[stepIndex] || steps[0];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#060709] px-4 text-center select-none">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ccff00]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-black tracking-tight text-white text-xl">
            Gym<span className="text-[#ccff00]">PRO</span>
          </span>
          <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#ccff00]">
            {badge}
          </span>
        </div>

        {/* OriginKit 3D Kinetic Dumbbell Lap Joint Loading Animation */}
        <div className="relative flex items-center justify-center my-3 w-52 h-52 sm:w-60 sm:h-60">
          <div className="absolute inset-0 rounded-full bg-[#ccff00]/10 blur-2xl pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <MetalLapJoint
              variant="dumbbell"
              baseColor="#ccff00"
              speed={48}
              distance={25}
              material={{ roughness: 42, reflect: 82 }}
              motion={{ spin: 20, fold: 90, hold: 28 }}
              camera={{ tilt: 30, sideTilt: 0 }}
              background="transparent"
            />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
        <p className="mt-1.5 text-xs text-zinc-400 font-medium px-4 leading-relaxed">{subtitle}</p>

        {/* Dynamic Progress Bar */}
        <div className="w-full mt-6 bg-[#121620] border border-[#1e2433] rounded-full h-2.5 p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#99cc00] via-[#ccff00] to-[#e6ff80] shadow-sm"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Percentage & Step Status */}
        <div className="flex items-center justify-between w-full mt-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            {progress >= 100 ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00]" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ccff00]" />
            )}
            <span className="font-mono text-zinc-300">{currentStep}</span>
          </div>
          <span className="font-mono font-bold text-[#ccff00]">{progress}%</span>
        </div>

        {/* Security & Reliability Badge */}
        <div className="mt-6 flex items-center gap-1.5 rounded-full border border-[#1e2638] bg-[#0c1017] px-3 py-1 text-xs text-zinc-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00]" />
          <span>High-Velocity Offline-Resilient Engine</span>
        </div>
      </div>
    </div>
  );
}
