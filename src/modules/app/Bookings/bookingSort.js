/**
 * Sort bookings by calendar date, then by earliest slot start time (morning before afternoon).
 * Used for owner list (date desc) and staff view (same day, time asc).
 */

import { parseSlotTitleStartMinutes } from "./bookingSlotTimeParse";

export { parseSlotTitleStartMinutes } from "./bookingSlotTimeParse";

function slotOrderingKey(slot) {
  if (!slot) return 1e9;
  const fromTitle = parseSlotTitleStartMinutes(slot.title);
  if (fromTitle != null) return fromTitle;
  if (typeof slot.sort === "number" && !Number.isNaN(slot.sort)) {
    return 24 * 60 + slot.sort;
  }
  return 48 * 60;
}

/** Earliest slot in the booking (for multi-slot bookings). */
export function getBookingEarliestSlotMinutes(booking) {
  const raw = booking?.slots || [];
  let best = Infinity;
  for (const s of raw) {
    const slot =
      s && typeof s === "object" && s.slot && typeof s.slot === "object"
        ? s.slot
        : s;
    if (!slot) continue;
    const k = slotOrderingKey(slot);
    if (k < best) best = k;
  }
  return best === Infinity ? 24 * 60 : best;
}

/** All-bookings list: newer dates first; same day → earlier slot first. */
export function compareBookingsByDateDescThenSlotAsc(a, b) {
  const dateA = new Date(a?.bookingDate);
  const dateB = new Date(b?.bookingDate);
  if (dateA.getTime() !== dateB.getTime()) {
    return dateB - dateA;
  }
  return (
    getBookingEarliestSlotMinutes(a) - getBookingEarliestSlotMinutes(b)
  );
}

/** Staff view / single-day lists: only by slot time ascending. */
export function compareBookingsBySlotTimeAsc(a, b) {
  return (
    getBookingEarliestSlotMinutes(a) - getBookingEarliestSlotMinutes(b)
  );
}
