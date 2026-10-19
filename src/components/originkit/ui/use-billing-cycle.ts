'use client';

import { useState } from 'react';

export function useBillingCycle(initialIsYearly: boolean = false) {
  const [isYearly, setIsYearly] = useState(initialIsYearly);

  const toggleBillingCycle = () => {
    setIsYearly((prev) => !prev);
  };

  return {
    isYearly,
    setIsYearly,
    toggleBillingCycle,
  };
}
