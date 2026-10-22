import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, ArrowLeft, Scale, Clock, AlertCircle, Dumbbell, Receipt } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions - GymPRO Commercial Gym Engine',
  description:
    'Commercial operating terms, membership rules, facility usage guidelines, and software terms of service for GymPRO.',
};

export default function TermsAndConditionsPage() {
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
            <FileCheck className="w-4 h-4" />
            <span>Commercial Operating Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-mono">
            Last Updated: October 2026 | Effective Date: Immediate | Jurisdiction: Bengaluru, India
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-10 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#ccff00]" />
              <span>1. Agreement Overview & Acceptance</span>
            </h2>
            <p>
              These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Member&quot;, &quot;Athlete&quot;, or &quot;User&quot;) and GymPRO (&quot;Platform&quot;), including the respective commercial fitness facility operating under the GymPRO multi-tenant infrastructure.
            </p>
            <p>
              By accessing any participating gym premises, submitting an inquiry, registering an account, or checking in via our digital pass system, you agree to comply with and be bound by these operational terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Receipt className="w-5 h-5 text-[#ccff00]" />
              <span>2. Membership Fees, UPI Dues & Invoicing</span>
            </h2>
            <p>
              Membership packages, personal coaching programs, and trial passes are billed according to the selected plan published on the facility pricing ledger.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Dues Settlement:</strong> All subscription dues must be settled via the verified gym UPI VPA or at the front desk on or before the due date indicated on your invoice.
              </li>
              <li>
                <strong className="text-zinc-200">Non-Refundable Policy:</strong> Membership fees and personal coaching fees are non-refundable once the billing period has commenced, subject to applicable consumer protection legislation.
              </li>
              <li>
                <strong className="text-zinc-200">Membership Freeze:</strong> Members on qualifying Quarterly and Annual passes are entitled to freeze their active status for up to 30 days per calendar year with prior written or front desk notice.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#ccff00]" />
              <span>3. Facility Access & Check-In Verification</span>
            </h2>
            <p>
              Admittance to the training floor, locker suites, and recovery amenities is restricted strictly to active, dues-cleared members and verified trial guests:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Each athlete must log entry through the designated front desk station via registered phone verification or personal QR pass.</li>
              <li>Passes and member profiles are strictly personal and non-transferable without prior administrative authorization.</li>
              <li>Operating hours are established per location (standard: Monday to Saturday 5:30 AM to 10:30 PM, Sunday hours as posted).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Dumbbell className="w-5 h-5 text-[#ccff00]" />
              <span>4. Safety Protocols & Equipment Etiquette</span>
            </h2>
            <p>
              To maintain an elite, safe, and professional training floor, all athletes must adhere to standard equipment safety procedures:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Barbells and power racks must be stripped and plates re-racked on storage trees after completion of exercises.</li>
              <li>Collars and safety clips must be used on all heavy barbell lifts (squats, bench press, overhead work).</li>
              <li>Proper athletic footwear and gym attire are mandatory at all times on the lifting floor.</li>
              <li>Equipment malfunctions or maintenance issues must be reported immediately to the floor coach or front desk staff.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#ccff00]" />
              <span>5. Physical Readiness & Limitation of Liability</span>
            </h2>
            <p>
              Physical exercise, strength training, and metabolic conditioning involve inherent risks of physical strain or injury. Members represent that they are in adequate physical health to engage in strenuous athletic exertion.
            </p>
            <p>
              Neither GymPRO nor the participating facility management shall be liable for personal injury, property loss from lockers, or damages resulting from improper equipment usage or violation of facility guidelines.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-white/10 pt-6">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              6. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any legal dispute, claim, or proceeding arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
