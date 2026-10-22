import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft, Database, PhoneCall, Server } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - GymPRO Commercial Gym Engine',
  description:
    'Operational data privacy policy for GymPRO multi-tenant gym management software, member records, and automated WhatsApp communication.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 antialiased selection:bg-[#ccff00] selection:text-black flex flex-col justify-between">
      {/* Universal Navigation Header */}
      <Header />

      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-[#ccff00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gym Floor</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#ccff00] mb-2 tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Policy Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            Operational Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono">
            Last Updated: October 2026 | Effective Date: Immediate | Version: 2.4-IND
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#ccff00]" />
              <span>1. Scope and Multi-Tenant Architecture</span>
            </h2>
            <p>
              GymPRO (&quot;we&quot;, &quot;platform&quot;, or &quot;service&quot;) provides operational software infrastructure for commercial fitness centers, independent strength clubs, and athletic training arenas across India. This Privacy Policy governs the collection, processing, storage, and protection of data processed when gym managers, staff members, and enrolled athletes interact with our software.
            </p>
            <p>
              Under our multi-tenant architecture, each gym client operates within an isolated logical data boundary. Member records registered at one facility remain segregated and are never accessible to other gym tenants.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#ccff00]" />
              <span>2. Categories of Information Collected</span>
            </h2>
            <p>We process only operational data strictly required to maintain facility security, attendance validation, and membership lifecycle accounting:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Athlete Identity Records:</strong> Full legal name, contact phone number, emergency contact, date of birth, and assigned membership tier.
              </li>
              <li>
                <strong className="text-zinc-200">Attendance & Check-in Telemetry:</strong> Timestamp of entry, check-in method (reception phone lookup, dynamic QR code pass, or turnstile scan), and gate status.
              </li>
              <li>
                <strong className="text-zinc-200">Billing & Payment Metadata:</strong> Payment reference numbers, UPI transaction identifiers, plan start and expiration dates, pending balance amounts, and invoice issuance history. We do not store raw credit card numbers or UPI MPIN credentials.
              </li>
              <li>
                <strong className="text-zinc-200">Dietary & Training Blueprints:</strong> Optional macro targets (protein/carb/fat grams), workout routine logs, and trainer notes recorded with explicit member consent.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-[#ccff00]" />
              <span>3. WhatsApp Communication & Notification Dispatch</span>
            </h2>
            <p>
              GymPRO integrates transactional messaging to provide instant billing transparency and automated membership alerts:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Instant payment receipts upon invoice settlement.</li>
              <li>Upcoming expiration warnings dispatched 7 days, 3 days, and on the day of membership lapse.</li>
              <li>Automated fee balance reminders with verified gym UPI VPAs for contact-free dues clearing.</li>
            </ul>
            <p>
              Messages are sent exclusively to the phone number submitted by the member upon registration. Members may request communication preference adjustments at their facility front desk at any time.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#ccff00]" />
              <span>4. Data Security, Encryption, and Access Control</span>
            </h2>
            <p>
              We implement defense-in-depth security standards to prevent unauthorized disclosure or loss of athlete and business records:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/10 bg-[#0e121a] p-4">
                <h3 className="font-bold text-white uppercase text-xs">Encryption in Transit</h3>
                <p className="text-[11px] text-zinc-400 mt-1">All communications between client devices and GymPRO servers are protected with TLS 1.3 encryption.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0e121a] p-4">
                <h3 className="font-bold text-white uppercase text-xs">Role-Based Access</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Front desk staff, floor trainers, and club administrators operate under strictly scoped privilege levels.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Server className="w-5 h-5 text-[#ccff00]" />
              <span>5. Data Retention & Member Rights</span>
            </h2>
            <p>
              Attendance logs and transaction receipts are retained for the duration required by applicable financial auditing laws and facility security requirements. In accordance with the Digital Personal Data Protection Act (DPDP), members retain the right to review their profile details, request rectification of erroneous data, or request account archival upon termination of membership.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              6. Grievance Redressal Coordinates
            </h2>
            <p>
              For privacy inquiries, data rectification requests, or regulatory questions, you may contact our designated operations team:
            </p>
            <div className="rounded-xl border border-white/10 bg-[#0e121a] p-4 font-mono text-xs text-zinc-300 space-y-1">
              <p><strong className="text-white">Officer:</strong> GymPRO Compliance & Security Operations</p>
              <p><strong className="text-white">Email:</strong> privacy@gympro.in</p>
              <p><strong className="text-white">Registered Hub:</strong> Sector 1, HSR Layout, Bengaluru, Karnataka 560102, India</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
