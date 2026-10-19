'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Workflow, 
  CheckCircle2, 
  Radio
} from 'lucide-react';

interface NodeTelemetry {
  id: string;
  name: string;
  tier: string;
  protocol: string;
  latency: string;
  status: string;
  description: string;
  specs: string[];
}

export function FacilityArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'lifecycle'>('architecture');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-ingress');

  const nodes: Record<string, NodeTelemetry> = {
    'node-ingress': {
      id: 'node-ingress',
      name: 'Biometric QR Ingress Gate',
      tier: 'EDGE & PERIMETER',
      protocol: 'ZeroMQ / MQTT (mTLS)',
      latency: '< 38ms',
      status: 'OPERATIONAL',
      description: 'High-speed physical turnstile optical scanner syncing member biometric tokens directly with the reception desk.',
      specs: ['1,200 scans/hour capacity', 'Offline cached token buffer', 'Optical anti-tailgating radar']
    },
    'node-core': {
      id: 'node-core',
      name: 'GymOS Realtime Ledger',
      tier: 'CORE DATA PLATFORM',
      protocol: 'PostgreSQL / Prisma / Razorpay Webhooks',
      latency: '< 18ms',
      status: 'SYNCHRONIZED',
      description: 'Central multi-tenant authority managing active check-ins, payment validation, and live gym floor capacity.',
      specs: ['Sub-second dues re-calculation', 'Instant UPI / Card settlement', 'Automated Indian GST tax compliance']
    },
    'node-equipment': {
      id: 'node-equipment',
      name: 'Olympic Floor & Rig Telemetry',
      tier: 'TRAINING FACILITY',
      protocol: 'BLE 5.2 / Hall-effect Sensors',
      latency: '< 55ms',
      status: 'LIVE CAPTURE',
      description: 'Monitored power racks, competition barbell stations, and plate-loaded zones tracking floor load density.',
      specs: ['Eleiko calibrated bar tracking', '50kg dumbbell rack balance', 'Zone occupancy heatmap']
    },
    'node-recovery': {
      id: 'node-recovery',
      name: 'Recovery & Bio-Optimization Suite',
      tier: 'RESTORATION ZONE',
      protocol: 'Modbus TCP / Temperature Loop',
      latency: '< 90ms',
      status: 'STABILIZED',
      description: 'Infrared cedar sauna and cold plunge circulation monitoring session duration and thermal protocols.',
      specs: ['3.5°C plunge bath cycle', '85°C dry infrared heat control', 'Coach recovery check-off']
    },
    'node-athlete-app': {
      id: 'node-athlete-app',
      name: 'Athlete Mobile Pass & Workout Engine',
      tier: 'CLIENT TOUCHPOINT',
      protocol: 'Next.js PWA / WebSockets',
      latency: '< 65ms',
      status: 'ACTIVE CONNECT',
      description: 'Member personal portal for dynamic entry QR codes, training PR logging, and instant renewal payments.',
      specs: ['Dynamic 60s rotating QR seed', 'Push notifications for renewal', 'Direct trainer messaging']
    }
  };

  const selectedNode = nodes[selectedNodeId] || nodes['node-ingress'];

  return (
    <section className="relative my-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header adhering to Cathryn Lavery Diagram-Design System */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#ccff00] font-semibold">
            OPERATIONAL SCHEMATIC · V2.6
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex p-1 bg-[#121316] border border-white/10 rounded-lg">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            01. OPERATIONAL ARCHITECTURE
          </button>
          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono transition-all ${
              activeTab === 'lifecycle'
                ? 'bg-[#ccff00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            02. ATHLETE LIFECYCLE FSM
          </button>
        </div>
      </div>

      {/* Main Schematic Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Diagram Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b0c0f] border border-white/10 rounded-xl p-5 relative overflow-hidden shadow-2xl">
          {/* Subtle Hairline Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Diagram Canvas Header */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-4 pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#ccff00]" />
              RUNTIME BUS: CONNECTED
            </span>
            <span className="hidden sm:inline">SCHEMATIC ID: IP-ARCH-2026.04</span>
            <span className="text-zinc-400">TARGET DENSITY: 4/10 · ZERO SLOP</span>
          </div>

          {activeTab === 'architecture' ? (
            /* ==============================================================
               MODE 1: ARCHITECTURE TOPOLOGY WITH ORTHOGONAL CONNECTORS
               Adheres to Cathryn Lavery references/type-architecture.md
               ============================================================== */
            <div className="relative">
              <svg 
                viewBox="0 0 740 400" 
                className="w-full h-auto select-none overflow-visible"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                <defs>
                  {/* Cathryn Lavery Standard Arrow Marker */}
                  <marker
                    id="cl-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ccff00" />
                  </marker>
                  <marker
                    id="cl-arrow-muted"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f5d75" />
                  </marker>
                </defs>

                {/* ---------------- ZONE CONTAINMENT BOUNDARIES ---------------- */}
                {/* Zone 1: Perimeter Access */}
                <rect x="20" y="30" width="210" height="340" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <rect x="32" y="24" width="130" height="14" rx="2" fill="#0b0c0f" />
                <text x="36" y="34" fill="#949eb2" fontSize="9" fontWeight="600" letterSpacing="0.12em">ZONE 01 · PERIMETER INGRESS</text>

                {/* Zone 2: Core Platform Engine */}
                <rect x="260" y="30" width="220" height="340" rx="8" fill="rgba(204,255,0,0.02)" stroke="rgba(204,255,0,0.2)" strokeWidth="1" />
                <rect x="272" y="24" width="140" height="14" rx="2" fill="#0b0c0f" />
                <text x="276" y="34" fill="#ccff00" fontSize="9" fontWeight="700" letterSpacing="0.12em">ZONE 02 · CORE ENGINE (FOCAL)</text>

                {/* Zone 3: Athletic Operations */}
                <rect x="510" y="30" width="210" height="340" rx="8" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <rect x="522" y="24" width="140" height="14" rx="2" fill="#0b0c0f" />
                <text x="526" y="34" fill="#949eb2" fontSize="9" fontWeight="600" letterSpacing="0.12em">ZONE 03 · FLOOR TELEMETRY</text>

                {/* ---------------- MANDATORY ORTHOGONAL CONNECTORS (r=8) ---------------- */}
                {/* Flow 1: Ingress (x=210, y=105) -> Core (x=280, y=105) */}
                <path
                  d="M 210 105 H 274"
                  fill="none"
                  stroke="#ccff00"
                  strokeWidth="1.6"
                  markerEnd="url(#cl-arrow)"
                />
                <text x="242" y="97" fill="#ccff00" fontSize="8" textAnchor="middle" fontWeight="600">AUTH PASS</text>

                {/* Flow 2: Athlete App (x=210, y=275) -> Core (x=280, y=275) */}
                <path
                  d="M 210 275 H 245 Q 253 275 253 267 V 210 Q 253 202 261 202 H 274"
                  fill="none"
                  stroke="#4f5d75"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  markerEnd="url(#cl-arrow-muted)"
                />

                {/* Flow 3: Core (x=460, y=130) -> Equipment Zone (x=530, y=105) */}
                <path
                  d="M 460 130 H 495 Q 503 130 503 122 V 113 Q 503 105 511 105 H 524"
                  fill="none"
                  stroke="#ccff00"
                  strokeWidth="1.4"
                  markerEnd="url(#cl-arrow)"
                />
                <text x="495" y="98" fill="#949eb2" fontSize="8" textAnchor="middle">ALLOCATE</text>

                {/* Flow 4: Core (x=460, y=210) -> Recovery Suite (x=530, y=275) */}
                <path
                  d="M 460 210 H 495 Q 503 210 503 218 V 267 Q 503 275 511 275 H 524"
                  fill="none"
                  stroke="#4f5d75"
                  strokeWidth="1.2"
                  markerEnd="url(#cl-arrow-muted)"
                />
                <text x="495" y="240" fill="#949eb2" fontSize="8" textAnchor="middle">RECOVERY</text>

                {/* ---------------- NODES (COMPONENTS) ---------------- */}
                {/* Node 1: Ingress Gate */}
                <g 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedNodeId('node-ingress')}
                >
                  <rect
                    x="40"
                    y="65"
                    width="170"
                    height="80"
                    rx="6"
                    fill="#15171c"
                    stroke={selectedNodeId === 'node-ingress' ? '#ccff00' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={selectedNodeId === 'node-ingress' ? '2' : '1'}
                  />
                  <rect x="40" y="65" width="4" height="80" rx="2" fill="#06b6d4" />
                  <text x="56" y="90" fill="#ffffff" fontSize="11" fontWeight="700">QR Turnstile Gate</text>
                  <text x="56" y="106" fill="#949eb2" fontSize="9">Biometric Scan &amp; RFID</text>
                  <rect x="56" y="117" width="56" height="16" rx="3" fill="rgba(6,182,212,0.15)" />
                  <text x="61" y="129" fill="#06b6d4" fontSize="8" fontWeight="600">38ms SYNC</text>
                </g>

                {/* Node 2: Athlete App */}
                <g 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedNodeId('node-athlete-app')}
                >
                  <rect
                    x="40"
                    y="235"
                    width="170"
                    height="80"
                    rx="6"
                    fill="#15171c"
                    stroke={selectedNodeId === 'node-athlete-app' ? '#ccff00' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={selectedNodeId === 'node-athlete-app' ? '2' : '1'}
                  />
                  <rect x="40" y="235" width="4" height="80" rx="2" fill="#a855f7" />
                  <text x="56" y="260" fill="#ffffff" fontSize="11" fontWeight="700">Mobile Member Pass</text>
                  <text x="56" y="276" fill="#949eb2" fontSize="9">Dynamic Seeded QR</text>
                  <rect x="56" y="287" width="64" height="16" rx="3" fill="rgba(168,85,247,0.15)" />
                  <text x="61" y="299" fill="#c084fc" fontSize="8" fontWeight="600">CLIENT TOKEN</text>
                </g>

                {/* Node 3: Core Engine (Focal Node in Accent) */}
                <g 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedNodeId('node-core')}
                >
                  <rect
                    x="280"
                    y="80"
                    width="180"
                    height="190"
                    rx="8"
                    fill="#171920"
                    stroke={selectedNodeId === 'node-core' ? '#ccff00' : '#ccff00'}
                    strokeWidth={selectedNodeId === 'node-core' ? '2.5' : '1.5'}
                    strokeDasharray="none"
                  />
                  <rect x="280" y="80" width="180" height="28" rx="8" fill="rgba(204,255,0,0.12)" />
                  <circle cx="296" cy="94" r="4" fill="#ccff00" />
                  <text x="308" y="98" fill="#ccff00" fontSize="10" fontWeight="800" letterSpacing="0.08em">GYMPRO CORE LEDGER</text>
                  
                  <text x="296" y="130" fill="#ffffff" fontSize="11" fontWeight="700">Razorpay / UPI Dues</text>
                  <text x="296" y="146" fill="#949eb2" fontSize="9">Instant Reconciliation (₹)</text>

                  <line x1="296" y1="160" x2="444" y2="160" stroke="rgba(255,255,255,0.08)" />

                  <text x="296" y="180" fill="#ffffff" fontSize="11" fontWeight="700">Multi-Tenant Vault</text>
                  <text x="296" y="196" fill="#949eb2" fontSize="9">Active Member Capacity</text>
                  
                  <rect x="296" y="215" width="148" height="26" rx="4" fill="#0d0e12" stroke="rgba(204,255,0,0.3)" />
                  <text x="306" y="232" fill="#ccff00" fontSize="9" fontWeight="700">AUTH ACCELERATOR &lt;18ms</text>
                </g>

                {/* Node 4: Floor Equipment */}
                <g 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedNodeId('node-equipment')}
                >
                  <rect
                    x="530"
                    y="65"
                    width="170"
                    height="80"
                    rx="6"
                    fill="#15171c"
                    stroke={selectedNodeId === 'node-equipment' ? '#ccff00' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={selectedNodeId === 'node-equipment' ? '2' : '1'}
                  />
                  <rect x="530" y="65" width="4" height="80" rx="2" fill="#10b981" />
                  <text x="546" y="90" fill="#ffffff" fontSize="11" fontWeight="700">Olympic Weight Rigs</text>
                  <text x="546" y="106" fill="#949eb2" fontSize="9">Calibrated Barbell Stations</text>
                  <rect x="546" y="117" width="62" height="16" rx="3" fill="rgba(16,185,129,0.15)" />
                  <text x="551" y="129" fill="#10b981" fontSize="8" fontWeight="600">ZONE ACTIVE</text>
                </g>

                {/* Node 5: Recovery Suite */}
                <g 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedNodeId('node-recovery')}
                >
                  <rect
                    x="530"
                    y="235"
                    width="170"
                    height="80"
                    rx="6"
                    fill="#15171c"
                    stroke={selectedNodeId === 'node-recovery' ? '#ccff00' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={selectedNodeId === 'node-recovery' ? '2' : '1'}
                  />
                  <rect x="530" y="235" width="4" height="80" rx="2" fill="#f59e0b" />
                  <text x="546" y="260" fill="#ffffff" fontSize="11" fontWeight="700">Recovery &amp; Plunge</text>
                  <text x="546" y="276" fill="#949eb2" fontSize="9">Sauna &amp; Cold Plunge Loop</text>
                  <rect x="546" y="287" width="58" height="16" rx="3" fill="rgba(245,158,11,0.15)" />
                  <text x="551" y="299" fill="#f59e0b" fontSize="8" fontWeight="600">3.5°C PLUNGE</text>
                </g>
              </svg>
            </div>
          ) : (
            /* ==============================================================
               MODE 2: ATHLETE LIFECYCLE STATE MACHINE (FSM)
               Adheres to Cathryn Lavery references/type-state.md
               ============================================================== */
            <div className="relative py-4">
              <svg 
                viewBox="0 0 740 320" 
                className="w-full h-auto select-none overflow-visible"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                <defs>
                  <marker
                    id="fsm-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ccff00" />
                  </marker>
                </defs>

                {/* State 1: Discovery */}
                <g>
                  <rect x="30" y="80" width="130" height="90" rx="6" fill="#13151a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="48" cy="100" r="4" fill="#64748b" />
                  <text x="60" y="104" fill="#ffffff" fontSize="10" fontWeight="700">01. PROSPECT</text>
                  <text x="44" y="126" fill="#949eb2" fontSize="8.5">Trial Request</text>
                  <text x="44" y="142" fill="#949eb2" fontSize="8.5">Phone Verification</text>
                </g>

                {/* Transition 1 -> 2 */}
                <path d="M 160 125 H 204" fill="none" stroke="#ccff00" strokeWidth="1.5" markerEnd="url(#fsm-arrow)" />
                <text x="182" y="117" fill="#ccff00" fontSize="7.5" textAnchor="middle" fontWeight="600">CLAIM</text>

                {/* State 2: Onboarded & Ingress */}
                <g>
                  <rect x="210" y="80" width="140" height="90" rx="6" fill="#13151a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="228" cy="100" r="4" fill="#06b6d4" />
                  <text x="240" y="104" fill="#ffffff" fontSize="10" fontWeight="700">02. ONBOARDED</text>
                  <text x="224" y="126" fill="#949eb2" fontSize="8.5">QR Biometric Pass</text>
                  <text x="224" y="142" fill="#949eb2" fontSize="8.5">Plan Activated (₹)</text>
                </g>

                {/* Transition 2 -> 3 */}
                <path d="M 350 125 H 394" fill="none" stroke="#ccff00" strokeWidth="1.5" markerEnd="url(#fsm-arrow)" />
                <text x="372" y="117" fill="#ccff00" fontSize="7.5" textAnchor="middle" fontWeight="600">INGRESS</text>

                {/* State 3: Active Training (Focal State) */}
                <g>
                  <rect x="400" y="65" width="150" height="120" rx="8" fill="#171920" stroke="#ccff00" strokeWidth="2" />
                  <rect x="400" y="65" width="150" height="24" rx="8" fill="rgba(204,255,0,0.15)" />
                  <circle cx="416" cy="77" r="4" fill="#ccff00" />
                  <text x="428" y="81" fill="#ccff00" fontSize="9" fontWeight="800">03. ACTIVE ATHLETE</text>
                  <text x="414" y="112" fill="#ffffff" fontSize="9" fontWeight="600">Calibrated Barbell Sets</text>
                  <text x="414" y="128" fill="#949eb2" fontSize="8.5">Coach Check-ins</text>
                  <text x="414" y="144" fill="#949eb2" fontSize="8.5">Telemetry Logging</text>
                  <rect x="414" y="156" width="122" height="18" rx="3" fill="#0d0e12" />
                  <text x="424" y="169" fill="#ccff00" fontSize="8" fontWeight="700">PEAK PERFORMANCE</text>
                </g>

                {/* Transition 3 -> 4 */}
                <path d="M 550 125 H 594" fill="none" stroke="#ccff00" strokeWidth="1.5" markerEnd="url(#fsm-arrow)" />
                <text x="572" y="117" fill="#ccff00" fontSize="7.5" textAnchor="middle" fontWeight="600">RELOAD</text>

                {/* State 4: Retained & Recovery */}
                <g>
                  <rect x="600" y="80" width="120" height="90" rx="6" fill="#13151a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="616" cy="100" r="4" fill="#10b981" />
                  <text x="626" y="104" fill="#ffffff" fontSize="10" fontWeight="700">04. RETAINED</text>
                  <text x="614" y="126" fill="#949eb2" fontSize="8.5">Cold Plunge Protocol</text>
                  <text x="614" y="142" fill="#949eb2" fontSize="8.5">Auto-Renewal (₹)</text>
                </g>

                {/* Return Loop: Retention back to Training (Cyclic Loop) */}
                <path
                  d="M 660 170 V 230 Q 660 238 652 238 H 483 Q 475 238 475 230 V 195"
                  fill="none"
                  stroke="#4f5d75"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  markerEnd="url(#fsm-arrow)"
                />
                <text x="570" y="232" fill="#949eb2" fontSize="8" textAnchor="middle">WEEKLY ATHLETIC LOOP</text>
              </svg>
            </div>
          )}

          {/* Interactive Hint */}
          <div className="mt-2 text-center text-xs font-mono text-zinc-500">
            Click any schematic node to inspect underlying hardware protocols &amp; telemetry
          </div>
        </div>

        {/* Live Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#111317] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                TELEMETRY INSPECTOR
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                {selectedNode.status}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-[#ccff00] font-semibold tracking-wider">
                {selectedNode.tier}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-4">
              <div className="bg-[#16181f] border border-white/5 p-2.5 rounded-lg">
                <span className="block text-[10px] font-mono text-zinc-500">BUS PROTOCOL</span>
                <span className="text-xs font-mono font-semibold text-zinc-200 truncate block mt-0.5">
                  {selectedNode.protocol}
                </span>
              </div>
              <div className="bg-[#16181f] border border-white/5 p-2.5 rounded-lg">
                <span className="block text-[10px] font-mono text-zinc-500">EDGE LATENCY</span>
                <span className="text-xs font-mono font-bold text-[#ccff00] block mt-0.5">
                  {selectedNode.latency}
                </span>
              </div>
            </div>

            {/* Key Engineering Specifications */}
            <div>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase block mb-2">
                VERIFIED SPECIFICATIONS
              </span>
              <ul className="space-y-1.5">
                {selectedNode.specs.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>AUDIT COMPLIANT: ISO 27001</span>
            <span className="text-[#ccff00]">ZERO LATENCY LOSS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
