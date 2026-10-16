import {
  Member,
  AttendanceRecord,
  PaymentRecord,
  EquipmentItem,
  LeadItem,
  ExpiringAlertItem,
  FinancialAnalytics,
  GymProfile
} from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  counts?: Record<string, number>;
  timestamp?: string;
}

export const gymApiClient = {
  // Gym CMS & Tenant Profiles
  async getGyms(publishedOnly = false): Promise<GymProfile[]> {
    const url = publishedOnly ? '/api/gyms?publishedOnly=true' : '/api/gyms';
    const res = await fetch(url);
    const json: ApiResponse<GymProfile[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch gyms');
    return json.data;
  },

  async getGymBySlug(slug: string): Promise<GymProfile> {
    const res = await fetch(`/api/gyms/${encodeURIComponent(slug)}`);
    const json: ApiResponse<GymProfile> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || `Gym not found: ${slug}`);
    return json.data;
  },

  async createGym(gym: Partial<GymProfile>): Promise<GymProfile> {
    const res = await fetch('/api/gyms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gym)
    });
    const json: ApiResponse<GymProfile> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to create gym profile');
    return json.data;
  },

  async updateGym(slugOrId: string, updates: Partial<GymProfile>): Promise<GymProfile> {
    const res = await fetch(`/api/gyms/${encodeURIComponent(slugOrId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const json: ApiResponse<GymProfile> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to update gym profile');
    return json.data;
  },

  async deleteGym(slugOrId: string): Promise<boolean> {
    const res = await fetch(`/api/gyms/${encodeURIComponent(slugOrId)}`, {
      method: 'DELETE'
    });
    const json: ApiResponse<{ deleted: boolean }> = await res.json();
    return Boolean(json.success);
  },

  // Members
  async getMembers(): Promise<Member[]> {
    const res = await fetch('/api/members');
    const json: ApiResponse<Member[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch members');
    return json.data;
  },

  async createMember(member: Partial<Member>): Promise<Member> {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    const json: ApiResponse<Member> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to create member');
    return json.data;
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const res = await fetch(`/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const json: ApiResponse<Member> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to update member');
    return json.data;
  },

  async deleteMember(id: string): Promise<boolean> {
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    const json: ApiResponse<{ deleted: boolean }> = await res.json();
    return Boolean(json.success);
  },

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    const res = await fetch('/api/attendance');
    const json: ApiResponse<AttendanceRecord[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch attendance');
    return json.data;
  },

  async logAttendance(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    const json: ApiResponse<AttendanceRecord> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to log attendance');
    return json.data;
  },

  // Payments
  async getPayments(): Promise<PaymentRecord[]> {
    const res = await fetch('/api/payments');
    const json: ApiResponse<PaymentRecord[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch payments');
    return json.data;
  },

  async recordPayment(payment: Partial<PaymentRecord>): Promise<PaymentRecord> {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    const json: ApiResponse<PaymentRecord> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to record payment');
    return json.data;
  },

  // Equipment
  async getEquipment(): Promise<EquipmentItem[]> {
    const res = await fetch('/api/equipment');
    const json: ApiResponse<EquipmentItem[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch equipment');
    return json.data;
  },

  async updateEquipmentStatus(id: string, status: EquipmentItem['status']): Promise<EquipmentItem> {
    const res = await fetch('/api/equipment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    const json: ApiResponse<EquipmentItem> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to update equipment');
    return json.data;
  },

  // Leads
  async getLeads(): Promise<LeadItem[]> {
    const res = await fetch('/api/leads');
    const json: ApiResponse<LeadItem[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch leads');
    return json.data;
  },

  async createLead(lead: Partial<LeadItem>): Promise<LeadItem> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    const json: ApiResponse<LeadItem> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to create lead');
    return json.data;
  },

  // Alerts
  async getExpiringAlerts(): Promise<{ alerts: ExpiringAlertItem[]; counts: Record<string, number> }> {
    const res = await fetch('/api/alerts/expiring');
    const json: ApiResponse<ExpiringAlertItem[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) throw new Error(json.error || 'Failed to fetch alerts');
    return {
      alerts: json.data,
      counts: json.counts || {}
    };
  },

  // Financial Analytics
  async getFinancialAnalytics(): Promise<FinancialAnalytics> {
    const res = await fetch('/api/reports/analytics');
    const json: ApiResponse<FinancialAnalytics> = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Failed to fetch analytics');
    return json.data;
  }
};
