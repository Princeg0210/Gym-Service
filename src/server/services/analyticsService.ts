import { memberRepository } from '../repositories/memberRepository';
import { paymentRepository } from '../repositories/paymentRepository';
import { computeFinancialAnalytics } from '@/lib/analytics';
import { FinancialAnalytics } from '@/types';

export const analyticsService = {
  async getFinancialAnalytics(): Promise<FinancialAnalytics> {
    const [members, payments] = await Promise.all([
      memberRepository.getAll(),
      paymentRepository.getAll()
    ]);

    return computeFinancialAnalytics(members, payments);
  }
};
