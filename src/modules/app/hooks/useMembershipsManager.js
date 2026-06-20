import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { showAlert } from "../../../context/AlertContext";
import useCurrentProperty from "./useCurrentProperty";
import useStore from "../../../zustand/useStore";

const useMembershipsManager = () => {
  const { propertyId } = useCurrentProperty();
  const triggerBookingsRefresh = useStore((s) => s.triggerBookingsRefresh);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setMemberships([]);
      return;
    }
    fetchMemberships();
  }, [propertyId]);

  const fetchMemberships = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "memberships"),
        where("propertyId", "==", propertyId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setMemberships(list);
    } catch (e) {
      console.error("Error fetching memberships:", e);
      showAlert("Failed to load memberships.", "error");
    } finally {
      setLoading(false);
    }
  };

  const addMembership = async (data) => {
    if (!propertyId) return null;
    try {
      const ref = await addDoc(collection(db, "memberships"), {
        ...data,
        propertyId,
        usedBookings: 0,
        createdAt: new Date().toISOString(),
      });
      await fetchMemberships();
      showAlert("Membership added successfully!", "success");
      return ref.id;
    } catch (e) {
      console.error("Error adding membership:", e);
      showAlert("Failed to add membership.", "error");
      return null;
    }
  };

  const updateMembership = async (id, data) => {
    try {
      await updateDoc(doc(db, "memberships", id), data);
      await fetchMemberships();
      showAlert("Membership updated.", "success");
    } catch (e) {
      console.error("Error updating membership:", e);
      showAlert("Failed to update membership.", "error");
    }
  };

  const deleteMembership = async (id) => {
    try {
      // Find all bookings linked to this membership
      const bookingsSnap = await getDocs(
        query(collection(db, "bookings"), where("membershipId", "==", id))
      );

      await Promise.all(
        bookingsSnap.docs.map(async (bookingDoc) => {
          const data = bookingDoc.data();
          const bookingId = bookingDoc.id;
          const date = data?.bookingDate;

          // Delete bookedSlot sub-docs for this booking
          if (date && propertyId) {
            const bookedSlotRef = collection(
              db,
              `properties/${propertyId}/bookings/${date}/bookedSlot`
            );
            const slotsSnap = await getDocs(bookedSlotRef);
            await Promise.all(
              slotsSnap.docs
                .filter((d) => d.data()?.bookingId === bookingId)
                .map((d) => deleteDoc(d.ref))
            );
          }

          await deleteDoc(bookingDoc.ref);
        })
      );

      await deleteDoc(doc(db, "memberships", id));
      await fetchMemberships();
      triggerBookingsRefresh();
      showAlert("Membership and its bookings deleted.", "success");
    } catch (e) {
      console.error("Error deleting membership:", e);
      showAlert("Failed to delete membership.", "error");
    }
  };

  const incrementUsedBookings = async (id) => {
    try {
      await updateDoc(doc(db, "memberships", id), {
        usedBookings: increment(1),
      });
    } catch (e) {
      console.error("Error incrementing membership bookings:", e);
    }
  };

  return {
    memberships,
    loading,
    fetchMemberships,
    addMembership,
    updateMembership,
    deleteMembership,
    incrementUsedBookings,
  };
};

export default useMembershipsManager;
