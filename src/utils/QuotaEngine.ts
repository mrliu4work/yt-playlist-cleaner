import { QuotaData, QuotaMode, QuotaStatus } from '../types/quota';

export const PUBLIC_DAILY_QUOTA_LIMIT = 10000;
export const PERSONAL_BYOK_QUOTA_LIMIT = 10000;
export const SAFETY_RESERVE_BUFFER = 500; // 500 units buffer = 10 delete calls safety margin
export const DELETE_COST_PER_ITEM = 50;
export const LIST_COST_PER_CALL = 1;

export class QuotaEngine {
  /**
   * Returns current date string in Pacific Time (America/Los_Angeles, YYYY-MM-DD)
   * YouTube Data API v3 resets quota at Midnight Pacific Time.
   */
  static getTodayPTDateString(): string {
    const now = new Date();
    // Use Intl to format as America/Los_Angeles YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const month = parts.find((p) => p.type === 'month')?.value || '01';
    const day = parts.find((p) => p.type === 'day')?.value || '01';
    const year = parts.find((p) => p.type === 'year')?.value || '2026';
    return `${year}-${month}-${day}`;
  }

  /**
   * Checks stored quota data and resets if Pacific Time date has changed.
   */
  static ensureFreshQuota(storedData: QuotaData | null): QuotaData {
    const todayPT = this.getTodayPTDateString();
    if (!storedData || storedData.lastResetDatePT !== todayPT) {
      return {
        dailyQuotaUsed: 0,
        lastResetDatePT: todayPT,
      };
    }
    return storedData;
  }

  /**
   * Calculates detailed Quota Status & max allowed deletions today
   */
  static calculateQuotaStatus(
    quotaData: QuotaData,
    mode: QuotaMode
  ): QuotaStatus {
    const freshQuota = this.ensureFreshQuota(quotaData);
    const limit = mode === 'BYOK_PERSONAL' ? PERSONAL_BYOK_QUOTA_LIMIT : PUBLIC_DAILY_QUOTA_LIMIT;
    const availableUnits = Math.max(0, limit - freshQuota.dailyQuotaUsed - SAFETY_RESERVE_BUFFER);
    const maxDeletableCount = Math.floor(availableUnits / DELETE_COST_PER_ITEM);

    return {
      mode,
      availableUnits,
      maxDeletableCount,
      isExhausted: maxDeletableCount <= 0,
      lastResetDatePT: freshQuota.lastResetDatePT,
    };
  }

  /**
   * Increments quota usage by cost
   */
  static addQuotaCost(currentData: QuotaData, cost: number): QuotaData {
    const freshData = this.ensureFreshQuota(currentData);
    return {
      ...freshData,
      dailyQuotaUsed: freshData.dailyQuotaUsed + cost,
    };
  }
}
