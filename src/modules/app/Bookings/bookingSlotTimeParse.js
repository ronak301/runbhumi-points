/**
 * Parse slot titles into times for sorting and live status.
 * Supports: "14:00 - 18:00" (24h), "7-9AM", "2-6PM", "10:30-11:30AM" (12h same meridiem),
 * and "HH:MM - HH:MM" with space " - " (existing data).
 */

/** @param {string} mer AM|PM */
function toMinutesFromMidnight12h(hour, minute, mer) {
  const m = String(mer || "").toUpperCase();
  if (m !== "AM" && m !== "PM") return null;
  if (m === "AM") {
    if (hour === 12) return minute;
    return hour * 60 + minute;
  }
  if (hour === 12) return 12 * 60 + minute;
  return (hour + 12) * 60 + minute;
}

/**
 * @returns {{ start: number, end: number } | null} minutes from midnight; end > start or spans to next day (+24h)
 */
export function parseSlotTitleIntervalMinutes(title) {
  if (!title || typeof title !== "string") return null;
  const t = title.trim();

  // Compact same-line AM/PM: "7-9AM", "2-6PM", "10:30-11:30AM" (no space before AM/PM)
  const compact = t.match(
    /^(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i
  );
  if (compact) {
    const sh = parseInt(compact[1], 10);
    const sm = compact[2] ? parseInt(compact[2], 10) : 0;
    const eh = parseInt(compact[3], 10);
    const em = compact[4] ? parseInt(compact[4], 10) : 0;
    const mer = compact[5].toUpperCase();
    const start = toMinutesFromMidnight12h(sh, sm, mer);
    const end = toMinutesFromMidnight12h(eh, em, mer);
    if (start == null || end == null) return null;
    let endAdj = end;
    if (endAdj <= start) endAdj += 24 * 60;
    return { start, end: endAdj };
  }

  // "HH:MM - HH:MM" (24h), possibly multiple spaces around hyphen
  const parts = t.split(/\s*-\s/).map((p) => p.trim());
  if (parts.length >= 2) {
    const startStr = parts[0];
    const endStr = parts[parts.length - 1];
    const sm = startStr.match(/^(\d{1,2}):(\d{2})/);
    const em = endStr.match(/^(\d{1,2}):(\d{2})/);
    if (sm && em) {
      const start = parseInt(sm[1], 10) * 60 + parseInt(sm[2], 10);
      const end = parseInt(em[1], 10) * 60 + parseInt(em[2], 10);
      let endAdj = end;
      if (endAdj <= start) endAdj += 24 * 60;
      return { start, end: endAdj };
    }
  }

  return null;
}

/** @returns {number | null} minutes from midnight for sort key */
export function parseSlotTitleStartMinutes(title) {
  const iv = parseSlotTitleIntervalMinutes(title);
  return iv ? iv.start : null;
}

/**
 * @param {string} bookingDateStr "YYYY-MM-DD"
 * @param {string} title
 * @returns {{ start: Date, end: Date } | null}
 */
export function parseSlotIntervalOnBookingDate(bookingDateStr, title) {
  if (!bookingDateStr || !title) return null;
  const mins = parseSlotTitleIntervalMinutes(title.trim());
  if (!mins) return null;
  const [y, mo, d] = bookingDateStr.split("-").map(Number);
  if (!y || !mo || !d) return null;

  const start = new Date(
    y,
    mo - 1,
    d,
    Math.floor(mins.start / 60),
    mins.start % 60,
    0,
    0
  );
  const end = new Date(
    start.getTime() + (mins.end - mins.start) * 60 * 1000
  );
  return { start, end };
}
