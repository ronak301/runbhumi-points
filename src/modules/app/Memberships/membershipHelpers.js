import moment from "moment";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

export const BOOKING_OPTIONS = [15, 30, 45, 60];

export const DEFAULT_AMOUNTS = { 15: 1000, 30: 2000, 45: 3000, 60: 4000 };

export async function sumMembershipsInRange(start, end, pid) {
  try {
    const q = query(
      collection(db, "memberships"),
      where("propertyId", "==", pid),
    );
    const snapshot = await getDocs(q);
    let total = 0;
    snapshot.forEach((d) => {
      const data = d.data();
      const created = (data.createdAt || "").slice(0, 10);
      if (created >= start && created <= end) {
        total +=
          typeof data.amount === "number"
            ? data.amount
            : Number(data.amount) || 0;
      }
    });
    return total;
  } catch (e) {
    console.warn("sumMembershipsInRange failed:", e?.message);
    return 0;
  }
}

export function computeEndDate(startDate, totalBookings) {
  if (!startDate || !totalBookings) return "";
  return moment(startDate)
    .add(totalBookings - 1, "days")
    .format("YYYY-MM-DD");
}

export function getMembershipStatus(membership) {
  const today = moment().format("YYYY-MM-DD");
  const exhausted = membership.usedBookings >= membership.totalBookings;
  const expired = membership.endDate < today;
  return exhausted || expired ? "past" : "active";
}

export function getMembershipWhatsAppMessage(membership, propertyTitle) {
  const amountLine = membership.amount
    ? `Amount Paid: Rs. ${Number(membership.amount).toLocaleString("en-IN")}\n`
    : "";
  return `*🏟️ Membership Confirmation*
*${propertyTitle || ""}*
Name: ${membership.name}
Mobile: ${membership.number}
Total Bookings: ${membership.totalBookings}
${amountLine}Start Date: ${moment(membership.startDate).format("DD/MM/YYYY")}
Valid Till: ${moment(membership.endDate).format("DD/MM/YYYY")}
Welcome to the family! 🎉`;
}
