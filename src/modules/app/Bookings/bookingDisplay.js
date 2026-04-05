/** Shared slot line for list cards (bookings list + staff view). */

function getFormattedTime(time) {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return time || "";
  }
  let [hours, minutes] = time.split(":").map((v) => Number(v || 0));
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return minutes === 0
    ? `${hours}`
    : `${hours}:${minutes.toString().padStart(2, "0")}`;
}

export function getSlotsSummary(booking, propertyId) {
  const rawSlots = booking?.slots || [];
  const slots = rawSlots
    .map((s) => {
      if (s && typeof s.title === "string") return s;
      if (s && s.slot && typeof s.slot.title === "string") return s.slot;
      return null;
    })
    .filter(Boolean);

  if (!slots.length) return "";

  if (propertyId === "iNANAwfMb6EXNtp7MRwJ") {
    const titles = slots.map((slot) => slot.title);
    const info = titles.join(", ");
    const matches = [...info.matchAll(/-/g)];
    const indexes = matches.map((match) => match.index);
    if (indexes.length === 1) return info;
    const start = indexes[0];
    const end = indexes[indexes.length - 1];
    return info.slice(0, start) + info.slice(end);
  }

  const courtId = slots[0]?.courtId;
  const courtLabel = courtId
    ? `Court ${courtId.replace("court", "")} • `
    : "";

  const titles = slots.map((slot) => slot.title);
  const firstSlot = titles[0];
  const lastSlot = titles[titles.length - 1];
  if (
    !firstSlot ||
    !lastSlot ||
    !firstSlot.includes(" - ") ||
    !lastSlot.includes(" - ")
  ) {
    return courtLabel + (firstSlot || "");
  }
  const startTime = firstSlot.split(" - ")[0];
  const endTime = lastSlot.split(" - ")[1];
  const suffix = Number(startTime.split(":")[0]) >= 12 ? "PM" : "AM";

  return `${courtLabel}${getFormattedTime(startTime)} - ${getFormattedTime(
    endTime
  )} ${suffix}`;
}
