import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../firebase";

export function buildMirrorPayload(booking, bookingId) {
  return {
    bookingId,
    bookingDate: booking.bookingDate,
    customer: booking.customer,
    slots: booking.slots,
    amountSumary: booking.amountSumary,
    property: booking.property,
    updatedAt: serverTimestamp(),
  };
}

async function getStaffViewToken(propertyId) {
  if (!propertyId) return null;
  const snap = await getDoc(doc(db, "properties", propertyId));
  return snap.data()?.staffViewToken || null;
}

/** Upsert read-only mirror doc for staff URL (token on property doc). */
export async function syncStaffViewMirror(propertyId, bookingId, booking) {
  try {
    const token = await getStaffViewToken(propertyId);
    if (!token || !bookingId || !booking) return;
    const ref = doc(
      db,
      "staffViewLinks",
      token,
      "mirrorBookings",
      bookingId
    );
    await setDoc(ref, buildMirrorPayload(booking, bookingId));
  } catch (e) {
    console.warn("staffView mirror sync:", e?.message);
  }
}

export async function deleteStaffViewMirror(propertyId, bookingId) {
  try {
    const token = await getStaffViewToken(propertyId);
    if (!token || !bookingId) return;
    await deleteDoc(doc(db, "staffViewLinks", token, "mirrorBookings", bookingId));
  } catch (e) {
    console.warn("staffView mirror delete:", e?.message);
  }
}

/**
 * After creating a staff link, copy existing today/tomorrow bookings into the mirror.
 */
export async function backfillStaffViewMirrors(propertyId) {
  const token = await getStaffViewToken(propertyId);
  if (!propertyId || !token) return { ok: false, count: 0 };

  const d0 = new Date();
  d0.setHours(0, 0, 0, 0);
  const d1 = new Date(d0);
  d1.setDate(d1.getDate() + 1);
  const todayStr = d0.toISOString().slice(0, 10);
  const tomorrowStr = d1.toISOString().slice(0, 10);

  let count = 0;
  for (const dayStr of [todayStr, tomorrowStr]) {
    const q = query(
      collection(db, "bookings"),
      where("property.id", "==", propertyId),
      where("bookingDate", "==", dayStr)
    );
    const snapshot = await getDocs(q);
    for (const d of snapshot.docs) {
      const data = d.data();
      await setDoc(
        doc(db, "staffViewLinks", token, "mirrorBookings", d.id),
        buildMirrorPayload({ ...data }, d.id)
      );
      count += 1;
    }
  }
  return { ok: true, count };
}

const BATCH_SIZE = 450;

/**
 * Invalidate staff URL: delete mirror rows, link doc, and clear token on property.
 */
export async function revokeStaffViewLink(propertyId, token) {
  if (!propertyId || !token) return { ok: false, error: "missing" };
  const mirrorCol = collection(
    doc(db, "staffViewLinks", token),
    "mirrorBookings"
  );
  const snap = await getDocs(mirrorCol);
  const refs = snap.docs.map((d) => d.ref);
  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    refs.slice(i, i + BATCH_SIZE).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, "staffViewLinks", token));
  await updateDoc(doc(db, "properties", propertyId), {
    staffViewToken: deleteField(),
  });
  return { ok: true };
}
