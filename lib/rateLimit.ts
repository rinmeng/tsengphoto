const RATE_LIMIT_KEY = 'contact_last_sent';
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

export function canSendEmail(): boolean {
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return true;
  return Date.now() - parseInt(last) > COOLDOWN_MS;
}

export function getRemainingCooldown(): number {
  const last = localStorage.getItem(RATE_LIMIT_KEY);
  if (!last) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - parseInt(last));
  return Math.max(0, remaining);
}

export function markEmailSent(): void {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}
