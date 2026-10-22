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
import { Loader2, CheckCircle2 } from 'lucide-react';
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
    ? 'Portal ready - Opening screen now...'
    : portal.steps[Math.min(stepIndex, portal.steps.length - 1)] || portal.steps[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060709]/96 backdrop-blur-xl px-4 text-center select-none"
    >
      {/* Dynamic Background Glow - Exact Lush Green Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(204,255,0,0.22)_0%,_rgba(150,200,0,0.10)_35%,_rgba(6,7,9,0.85)_70%,_#060709_100%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#ccff00]/18 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#ccff00]/12 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Large Prominent OriginKit 3D Kinetic Round Dumbbell Loading Animation (Sleek Black) */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px]">
          <div className="absolute inset-0 rounded-full bg-[#ccff00]/20 blur-3xl pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <MetalLapJoint
              variant="dumbbell"
              baseColor="#121216"
              speed={48}
              distance={13}
              material={{ roughness: 28, reflect: 95 }}
              motion={{ spin: 20, fold: 90, hold: 28 }}
              camera={{ tilt: 28, sideTilt: 0 }}
              background="transparent"
            />
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full max-w-sm mt-3 bg-[#121620] border border-[#1e2433] rounded-full h-2.5 p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#99cc00] via-[#ccff00] to-[#e6ff80] shadow-sm"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Percentage & Step Status */}
        <div className="flex items-center justify-between w-full max-w-sm mt-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium truncate pr-2">
            {isFinishing ? (
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#ccff00]" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-[#ccff00]" />
            )}
            <span className="font-mono text-zinc-300 truncate">{currentStep}</span>
          </div>
          <span className="font-mono font-bold text-[#ccff00] flex-shrink-0">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Standalone Route Loading Screen (for loading.tsx files)
// ─────────────────────────────────────────────────────────────

export function RouteLoadingScreen({
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
    'Finalizing interface - Welcome to GymPRO'
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
    ? 'Portal ready - Opening screen now...'
    : steps[stepIndex] || steps[0];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#060709] px-4 text-center select-none">
      {/* Dynamic Background Glow - Exact Lush Green Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(204,255,0,0.22)_0%,_rgba(150,200,0,0.10)_35%,_rgba(6,7,9,0.85)_70%,_#060709_100%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#ccff00]/18 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#ccff00]/12 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Large Prominent OriginKit 3D Kinetic Round Dumbbell Loading Animation (Sleek Black) */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px]">
          <div className="absolute inset-0 rounded-full bg-[#ccff00]/20 blur-3xl pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <MetalLapJoint
              variant="dumbbell"
              baseColor="#121216"
              speed={48}
              distance={13}
              material={{ roughness: 28, reflect: 95 }}
              motion={{ spin: 20, fold: 90, hold: 28 }}
              camera={{ tilt: 28, sideTilt: 0 }}
              background="transparent"
            />
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full max-w-sm mt-3 bg-[#121620] border border-[#1e2433] rounded-full h-2.5 p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#99cc00] via-[#ccff00] to-[#e6ff80] shadow-sm"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Percentage & Step Status */}
        <div className="flex items-center justify-between w-full max-w-sm mt-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium truncate pr-2">
            {progress >= 100 ? (
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#ccff00]" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin text-[#ccff00]" />
            )}
            <span className="font-mono text-zinc-300 truncate">{currentStep}</span>
          </div>
          <span className="font-mono font-bold text-[#ccff00] flex-shrink-0">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
