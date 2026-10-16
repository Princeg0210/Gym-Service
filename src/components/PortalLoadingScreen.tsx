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

  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPortal, setTargetPortal] = useState<PortalInfo | null>(null);
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const targetPathRef = useRef<string | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          steps: ['Initializing portal environment...', 'Synchronizing data...', 'Opening view...']
        };

      targetPathRef.current = normalizedPath;
      setTargetPortal({ ...portalConfig, ...customOptions });
      setIsNavigating(true);
      setIsFinishing(false);
      setProgress(20);
      setStepIndex(0);

      // Start route push
      startTransition(() => {
        router.push(path);
      });

      // Clear any prior safety timeout
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      // Auto-fallback after 4.5s in case of unexpected network stall
      safetyTimeoutRef.current = setTimeout(() => {
        setIsFinishing(true);
        setProgress(100);
        setTimeout(() => {
          setIsNavigating(false);
          setTargetPortal(null);
          setIsFinishing(false);
          setProgress(15);
          setStepIndex(0);
          targetPathRef.current = null;
        }, 350);
      }, 4500);
    },
    [pathname, router, isNavigating]
  );

  const notifyPageReady = useCallback((pagePath?: string) => {
    // If a specific path was passed and doesn't match our target, ignore
    if (pagePath && targetPathRef.current && targetPathRef.current !== pagePath) {
      return;
    }

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    setIsFinishing(true);
    setProgress(100);

    // Keep screen visible momentarily at 100% so the user perceives completion, then fade out
    setTimeout(() => {
      setIsNavigating(false);
      setTargetPortal(null);
      setIsFinishing(false);
      setProgress(15);
      setStepIndex(0);
      targetPathRef.current = null;
    }, 400);
  }, []);

  // Progressive timer while waiting for the portal screen to finish loading
  useEffect(() => {
    if (!isNavigating || isFinishing) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Hold at 88% until the destination page announces notifyPageReady
        if (prev >= 88) return prev;
        const jump = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + jump, 88);
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (!targetPortal?.steps || prev >= targetPortal.steps.length - 1) return prev;
        return prev + 1;
      });
    }, 280);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isNavigating, isFinishing, targetPortal]);

  // Fallback observer: if the route has switched to target path and 600ms elapse without explicit notifyPageReady, auto-complete
  useEffect(() => {
    if (!isNavigating || isFinishing) return;
    if (targetPathRef.current && pathname === targetPathRef.current) {
      const fallbackTimer = setTimeout(() => {
        notifyPageReady(targetPathRef.current || undefined);
      }, 600);
      return () => clearTimeout(fallbackTimer);
    }
  }, [pathname, isNavigating, isFinishing, notifyPageReady]);

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

        {/* Central Animated Portal Icon */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute -inset-3 rounded-3xl border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin" />
          <div className="absolute -inset-5 rounded-3xl border border-[#ccff00]/10 animate-pulse" />

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#121724] border border-[#263147] text-[#ccff00] shadow-xl shadow-black/50">
            {portal.icon === 'admin' ? (
              <ShieldCheck className="h-10 w-10 text-[#ccff00]" />
            ) : portal.icon === 'member' ? (
              <Dumbbell className="h-10 w-10 text-[#ccff00]" />
            ) : (
              <LayoutGrid className="h-10 w-10 text-[#ccff00]" />
            )}
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
  icon = 'showcase'
}: {
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: 'admin' | 'member' | 'showcase';
}) {
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

        {/* Central Icon */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute -inset-3 rounded-3xl border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin" />
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#121724] border border-[#263147] text-[#ccff00] shadow-xl shadow-black/50">
            {icon === 'admin' ? (
              <ShieldCheck className="h-10 w-10 text-[#ccff00]" />
            ) : icon === 'member' ? (
              <Dumbbell className="h-10 w-10 text-[#ccff00]" />
            ) : (
              <LayoutGrid className="h-10 w-10 text-[#ccff00]" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
        <p className="mt-1.5 text-xs text-zinc-400 font-medium px-4 leading-relaxed">{subtitle}</p>

        {/* Loading Spinner Indicator */}
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Loader2 className="h-4 w-4 animate-spin text-[#ccff00]" />
          <span className="font-mono text-[#ccff00]">Opening Portal...</span>
        </div>
      </div>
    </div>
  );
}
