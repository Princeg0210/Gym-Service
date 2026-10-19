'use client';

import React from 'react';
import { useBillingCycle } from '@/components/originkit/ui/use-billing-cycle';

/** Asset root — flat files in package assets/. */
const A = '/sections/pricing-02/assets';

export type PricingPlan = {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  buttonLabel: string;
  isPopular?: boolean;
  features: string[];
};

export const DEFAULT_GYM_PLANS: PricingPlan[] = [
  {
    name: 'Starter Plan',
    description: 'Perfect for self-directed athletes seeking full gym floor, free weights, and machine arena access.',
    monthlyPrice: 1999,
    yearlyPrice: 17999,
    buttonLabel: 'Get Started',
    features: [
      'Full Gym Floor & Free Weights Arena',
      'Olympic Power Racks & Plate-Loaded Rigs',
      'Locker Room & High-Pressure Showers',
      'Mobile QR Check-in & Workout Tracker',
    ],
  },
  {
    name: 'Growth & Pro Plan',
    description: 'Accelerate your physique transformations with personal coach guidance and customized diet blueprints.',
    monthlyPrice: 4999,
    yearlyPrice: 45000,
    buttonLabel: 'Accelerate Growth',
    isPopular: true,
    features: [
      'Unlimited All-Branch Arena Access',
      '1-on-1 Personal Trainer Coaching Sessions',
      'Custom High-Protein Indian Diet Blueprint',
      'Instant WhatsApp Invoices & Receipts',
      '30 Days Free Membership Freeze Allowance',
    ],
  },
  {
    name: 'Elite VIP Plan',
    description: 'For dedicated athletes demanding bespoke master coaching, dedicated recovery, and concierge access.',
    monthlyPrice: null,
    yearlyPrice: null,
    buttonLabel: 'Request Custom Quote',
    features: [
      'Dedicated Master Coach & Bi-Weekly Reviews',
      'Comprehensive Biomarker & Body Fat Scans',
      'Dedicated VIP Locker & Laundry Care',
      'Unlimited Complimentary Guest Passes',
    ],
  },
];

const getDisplayPrice = (
  monthlyPrice: number,
  yearlyPrice: number,
  isYearly: boolean,
) => (isYearly ? yearlyPrice : monthlyPrice);

const BillingToggle = ({
  isYearly,
  onChange,
}: {
  isYearly: boolean;
  onChange: () => void;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isYearly}
      aria-label="Toggle yearly billing"
      onClick={onChange}
      className="relative h-8 w-14 shrink-0 cursor-pointer rounded-full border border-solid border-[#262626] bg-[#1f1f1f] transition-colors duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cef240] motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 size-7 rounded-full bg-[#cef240] transition-transform duration-200 ease-out motion-reduce:transition-none ${
          isYearly ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

const FeatureItem = ({ label }: { label: string }) => {
  return (
    <li className="flex items-center gap-2">
      <span className="flex shrink-0 items-start rounded-full bg-[#1f1f1f] p-1.5">
        <img
          alt=""
          aria-hidden="true"
          src={`${A}/checkmark.svg`}
          width={18}
          height={18}
          className="size-4.5"
        />
      </span>
      <span className="min-w-0 flex-1 text-[15px] sm:text-[16px] font-normal leading-normal text-[#b0b1b5]">
        {label}
      </span>
    </li>
  );
};

export interface Pricing02Props {
  heading?: string;
  subheading?: string;
  badgeLabel?: string;
  plans?: PricingPlan[];
  currencySymbol?: string;
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const Pricing02: React.FC<Pricing02Props> = ({
  heading = 'Unlock Your Physical Potential With Transparent Membership Plans',
  subheading = 'Clear Indian Rupee pricing with zero surprise charges. Instant UPI confirmation, certified coaches, and flexible billing cycles.',
  badgeLabel = 'Pricing plans',
  plans = DEFAULT_GYM_PLANS,
  currencySymbol = '₹',
  onSelectPlan,
}) => {
  const { isYearly, toggleBillingCycle } = useBillingCycle();

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative min-h-fit border-b border-[#1c212e] bg-[#0f0f0f] px-4 py-16 text-[#f2f2f3] sm:px-6 sm:py-24"
    >
      <div className="flex w-full md:max-w-[620px] lg:max-w-[980px] xl:max-w-[1140px] md:mx-auto flex-col items-center gap-10">
        <header className="flex w-full max-w-[840px] flex-col items-center gap-2.5 text-center">
          <span className="flex items-center gap-1.5 rounded-[42px] border border-[#1f1f1f] bg-[#141414] px-3.5 py-1.5 shadow-sm">
            <img
              alt=""
              aria-hidden="true"
              src={`${A}/verified-check.svg`}
              width={20}
              height={20}
              className="size-5"
            />
            <span className="text-[14px] sm:text-[15px] font-semibold leading-normal tracking-[0.02em] text-[#daf66f]">
              {badgeLabel}
            </span>
          </span>

          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h2
              id="pricing-heading"
              className="w-full text-[28px] lg:text-[40px] xl:text-[48px] text-balance text-center font-bold leading-[1.2] tracking-[0.02em] text-[#f2f2f3]"
            >
              {heading}
            </h2>
            <p className="w-full max-w-[680px] text-[15px] sm:text-[17px] xl:text-[18px] font-normal leading-relaxed tracking-[0.02em] text-[#96979c]">
              {subheading}
            </p>
          </div>
        </header>

        <div className="flex w-full flex-col items-center gap-10">
          {/* Monthly / Yearly Toggle Switch */}
          <div className="relative mt-8 sm:mt-10 flex items-center gap-4 rounded-[70px] bg-[#141414] px-5 py-2.5 border border-[#1f1f1f]">
            <span
              className={`text-base font-semibold leading-normal tracking-[0.02em] transition-colors duration-200 ease motion-reduce:transition-none cursor-pointer ${
                isYearly ? 'text-[#cacbce]' : 'text-[#cef240]'
              }`}
              onClick={() => isYearly && toggleBillingCycle()}
            >
              Monthly
            </span>

            <BillingToggle isYearly={isYearly} onChange={toggleBillingCycle} />

            <span
              className={`relative inline-block text-base font-semibold leading-normal tracking-[0.02em] transition-colors duration-200 ease motion-reduce:transition-none cursor-pointer ${
                isYearly ? 'text-[#cef240]' : 'text-[#cacbce]'
              }`}
              onClick={() => !isYearly && toggleBillingCycle()}
            >
              Yearly
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-0 z-10 flex items-start gap-1 select-none md:hidden"
              >
                <img
                  alt=""
                  src={`${A}/save-arrow.svg`}
                  width={44}
                  height={29}
                  className="h-8 w-10 -rotate-20"
                />
                <span className="relative -top-3 whitespace-nowrap text-xs sm:text-sm font-bold leading-normal tracking-[0.02em] text-[#cef240]">
                  ( Save 20% )
                </span>
                <img
                  alt=""
                  src={`${A}/sparkle.svg`}
                  width={11}
                  height={11}
                  className="relative -top-2 -rotate-8 size-2.5"
                />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-0 z-10 hidden items-start gap-1 select-none md:flex md:-top-11 md:left-14"
              >
                <img
                  alt=""
                  src={`${A}/save-arrow.svg`}
                  width={44}
                  height={29}
                  className="h-9 w-11 rotate-12"
                />
                <span className="relative top-2 whitespace-nowrap text-sm sm:text-base font-bold leading-normal tracking-[0.02em] text-[#cef240]">
                  ( Save 20% )
                </span>
                <img
                  alt=""
                  src={`${A}/sparkle.svg`}
                  width={11}
                  height={11}
                  className="relative top-0 size-3"
                />
              </span>
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid w-full grid-cols-1 items-stretch justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const price =
                plan.monthlyPrice === null || plan.yearlyPrice === null
                  ? null
                  : getDisplayPrice(
                      plan.monthlyPrice,
                      plan.yearlyPrice,
                      isYearly,
                    );

              const isStarter = plan.name.toLowerCase().includes('starter');
              const arrowSrc = plan.isPopular
                ? `${A}/arrow-right-dark.svg`
                : `${A}/arrow-right.svg`;

              return (
                <article
                  key={plan.name}
                  className={`flex w-full flex-col gap-6 overflow-hidden rounded-2xl border bg-[#141414] p-6 sm:p-7 transition-all ${
                    plan.isPopular
                      ? 'h-full order-1 border-[#cef240] shadow-[0px_0px_0px_5px_#1a1a1a] md:col-span-2 lg:order-2 lg:col-span-1'
                      : isStarter
                        ? 'h-full order-2 border-[#1f1f1f] lg:order-1'
                        : 'h-full order-3 border-[#1f1f1f]'
                  }`}
                >
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-center justify-between gap-3">
                      <h3 className="min-w-0 flex-1 text-[20px] xl:text-[22px] font-bold leading-normal text-[#f2f2f3]">
                        {plan.name}
                      </h3>

                      {plan.isPopular && (
                        <span className="flex shrink-0 items-center gap-1.5 rounded-[42px] border border-[#262626] bg-[#1a1a1a] px-3 py-1.5 shadow-sm">
                          <img
                            alt=""
                            aria-hidden="true"
                            src={`${A}/balloon.svg`}
                            width={18}
                            height={18}
                            className="size-4.5"
                          />
                          <span className="text-xs font-bold leading-normal tracking-[0.02em] text-[#cef240]">
                            Popular
                          </span>
                        </span>
                      )}
                    </div>

                    <div
                      aria-hidden="true"
                      className="h-px w-full bg-[#1f1f1f]"
                    />

                    <p className="text-[14px] xl:text-[15px] font-normal leading-relaxed text-[#96979c]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    {price === null ? (
                      <p className="text-[32px] xl:text-[36px] font-black whitespace-nowrap text-[#cef240]">
                        Custom pricing
                      </p>
                    ) : (
                      <>
                        <p className="text-[36px] xl:text-[40px] font-black tabular-nums text-[#cef240] transition-opacity duration-200">
                          {currencySymbol}{price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-[#96979c]">
                          /{isYearly ? 'year' : 'month'}
                        </p>
                      </>
                    )}
                  </div>

                  <ul className="flex w-full flex-1 flex-col gap-3.5 my-2">
                    {plan.features.map((feature) => (
                      <FeatureItem key={feature} label={feature} />
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onSelectPlan && onSelectPlan(plan)}
                    className={`group relative flex min-h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-[53px] border border-[#262626] px-5 py-3.5 text-[15px] font-bold leading-[1.2] tracking-[0.02em] transition-all duration-200 ease active:scale-95 ${
                      plan.isPopular
                        ? 'bg-[#cef240] text-[#0f0f0f] shadow-md hover:brightness-105'
                        : 'bg-[#1a1a1a] text-[#f2f2f3] hover:bg-[#222222] hover:border-zinc-700'
                    }`}
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <span>{plan.buttonLabel}</span>
                      <span
                        aria-hidden="true"
                        className="inline-flex transition-transform duration-200 ease group-hover:translate-x-1"
                      >
                        <img
                          alt=""
                          src={arrowSrc}
                          width={18}
                          height={18}
                          className="size-4.5"
                        />
                      </span>
                    </span>
                    {plan.isPopular ? (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[53px] opacity-0 transition-opacity duration-200 ease group-hover:opacity-100"
                      >
                        <div className="absolute inset-y-[-20%] left-0 flex w-full animate-shine-infinite">
                          <div className="h-full w-14 -skew-x-12 bg-white/60 blur-[6px]" />
                        </div>
                      </div>
                    ) : null}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing02;
