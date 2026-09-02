export type QuotaMode = 'PUBLIC_SHARED' | 'BYOK_PERSONAL';

export interface QuotaData {
  dailyQuotaUsed: number;
  lastResetDatePT: string; // Pacific Time YYYY-MM-DD
}

export interface QuotaStatus {
  mode: QuotaMode;
  availableUnits: number;
  maxDeletableCount: number;
  isExhausted: boolean;
  lastResetDatePT: string;
}
