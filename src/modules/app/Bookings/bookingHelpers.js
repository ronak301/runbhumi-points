import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

/** PickleX: Sat/Sun 7PM–12AM = ₹600 per half hour; else ₹300. Other properties use slot.price. */
export const PICKLEX_PROPERTY_ID = "2H3Ld4uq17AeCtfXpuo0";

export function getSlotPriceForDate(slot, dateStr, propertyId) {
  if (propertyId !== PICKLEX_PROPERTY_ID) {
    return Number(slot?.price) || 300;
  }
  const day = new Date(dateStr).getDay();
  const isWeekend = day === 0 || day === 6;
  const match = (slot?.title || "").match(/^(\d{1,2}):/);
  const hour = match ? parseInt(match[1], 10) : 0;
  const isPeakTime = hour >= 19 && hour < 24;
  return isWeekend && isPeakTime ? 600 : 300;
}

export async function fetchBookedSlotsForDate(propertyId, date) {
  if (!propertyId || !date) return [];
  const slotsCollectionRef = collection(
    db,
    `properties/${propertyId}/bookings/${date}/bookedSlot`
  );
  const snapshot = await getDocs(slotsCollectionRef);
  const slots = [];
  snapshot.forEach((slotDoc) => {
    slots.push({ ...slotDoc.data(), id: slotDoc.id });
  });
  return slots;
}

/**
 * Match persisted booking slots to current property slot definitions (sort, price).
 */
/** Digits only, max 10 (Indian mobile). */
export function getPhoneDigits(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export function isValidTenDigitPhone(value) {
  return getPhoneDigits(value).length === 10;
}

/**
 * First validation issue for disabling submit and showing inline error (add + edit booking).
 */
export function getBookingFormBlockingError({
  name,
  date,
  phoneValue,
  selectedSlotCount,
}) {
  if (!selectedSlotCount) {
    return "No slots are selected.";
  }
  const digits = getPhoneDigits(phoneValue);
  if (digits.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }
  if (!String(name ?? "").trim()) {
    return "Enter customer name.";
  }
  if (!date) {
    return "Select a booking date.";
  }
  return null;
}

export function mergeBookingSlotsWithProperty(
  bookingSlots,
  propertySlots
) {
  const list = Array.isArray(bookingSlots) ? bookingSlots : [];
  const defs = Array.isArray(propertySlots) ? propertySlots : [];
  return list
    .map((s) => {
      const raw = s?.slot && typeof s.slot === "object" ? s.slot : s;
      if (!raw?.title) return null;
      const match = defs.find(
        (ps) =>
          ps.title === raw.title &&
          (ps.courtId || "court1") === (raw.courtId || "court1")
      );
      return match || raw;
    })
    .filter(Boolean);
}
