import { memberRepository } from '../repositories/memberRepository';
import { generateMembersAccountingCsv } from '@/lib/analytics';

export const accountingExportService = {
  async exportMembersCsv(): Promise<{ csvContent: string; filename: string }> {
    const members = await memberRepository.getAll();
    const csvContent = generateMembersAccountingCsv(members);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `gympro-accounts-report-${dateStr}.csv`;

    return { csvContent, filename };
  }
};
