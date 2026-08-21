export const DAILY_FIELD_MAX = 5;
export const LOW_SAMPLE = 8;
export const DEFAULT_RESEND_FROM = "The Call <login@scopethecall.com>";

export function parseDayKey(value) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return "";
  const [year, month, day] = text.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return "";
  }
  return text;
}

export function dayKeyInWindow(dayKey, nowMs = Date.now(), padDays = 2) {
  if (!dayKey) return false;
  const [year, month, day] = dayKey.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day);
  const pad = padDays * 86400000;
  return utc >= nowMs - pad - 86400000 && utc <= nowMs + pad;
}

export function parseTrayId(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(text)) return "";
  return text;
}

export function parseFieldIndex(value, max = DAILY_FIELD_MAX) {
  if (value === "" || value == null) return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isInteger(n) || n < 0 || n > max) return null;
  return n;
}

export function parseGuess(value) {
  const text = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  if (!text || text.length > 200) return "";
  return text;
}

export function parseSpecimenId(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (!/^[a-zA-Z0-9._:-]{1,80}$/.test(text)) return "";
  return text;
}

export function aggregateSplit(rows) {
  const counts = new Map();
  for (const row of rows || []) {
    const label = String(row.guess || "").trim();
    if (!label) continue;
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  const n = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const split = [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: n ? Math.round((count / n) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return { n, split };
}

export function shortCallLabel(label) {
  const text = String(label || "").trim();
  const match = text.match(/^(.*) \((.+)\)$/);
  return match ? match[1] : text;
}

export function parseResendError(text, status) {
  const raw = String(text || "").trim();
  if (!raw) return `Resend HTTP ${status}`;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.message === "string" && parsed.message.trim()) return parsed.message.trim();
    if (typeof parsed.error === "string" && parsed.error.trim()) return parsed.error.trim();
    if (parsed.error && typeof parsed.error.message === "string" && parsed.error.message.trim()) {
      return parsed.error.message.trim();
    }
  } catch {
    /* use raw body */
  }
  return raw.slice(0, 400);
}

export function resendFrom(value) {
  const text = String(value || "").trim();
  return text || DEFAULT_RESEND_FROM;
}
