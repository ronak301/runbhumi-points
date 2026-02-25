import { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { showAlert } from "../../../context/AlertContext";
import useCurrentProperty from "./useCurrentProperty";

export const LIMIT = 20;

// offset = 0 → this month, -1 → last month, etc.
function getMonthRange(offset = 0) {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const y = base.getFullYear();
  const mIndex = base.getMonth(); // 0-based
  const mNum = mIndex + 1;
  const mm = String(mNum).padStart(2, "0");
  const lastDay = new Date(y, mIndex + 1, 0).getDate();
  return {
    start: `${y}-${mm}-01`,
    end: `${y}-${mm}-${lastDay}`,
  };
}

const useBookingsManager = () => {
  const { propertyId } = useCurrentProperty();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [busy, setBusy] = useState(false);

  // This month and last month totals from loaded bookings (no extra query)
  const monthlyCollectionTotal = useMemo(() => {
    const { start, end } = getMonthRange(0);
    return (bookings || []).reduce((sum, b) => {
      const date = b?.bookingDate;
      if (!date || date < start || date > end) return sum;
      const t = b?.amountSumary?.total;
      return sum + (typeof t === "number" ? t : Number(t) || 0);
    }, 0);
  }, [bookings]);

  const lastMonthCollectionTotal = useMemo(() => {
    const { start, end } = getMonthRange(-1);
    return (bookings || []).reduce((sum, b) => {
      const date = b?.bookingDate;
      if (!date || date < start || date > end) return sum;
      const t = b?.amountSumary?.total;
      return sum + (typeof t === "number" ? t : Number(t) || 0);
    }, 0);
  }, [bookings]);

  // Next/upcoming booking first: date desc (today & recent first), then earliest slot in day first.
  const sortDataBySlots = (data) => {
    const list = Array.isArray(data) ? [...data] : [];
    return list.sort((a, b) => {
      const dateA = new Date(a?.bookingDate);
      const dateB = new Date(b?.bookingDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB - dateA; // newer date first (21 Feb before 7 Feb)
      }
      const slotA = a?.slots?.[0]?.sort ?? 0;
      const slotB = b?.slots?.[0]?.sort ?? 0;
      return slotA - slotB; // same day: earlier slot first
    });
  };

  useEffect(() => {
    if (!propertyId) {
      setBookings([]);
      setLastVisible(null);
      return;
    }
    setLastVisible(null);
    fetchBookings();
  }, [propertyId]);

  const fetchBookings = async (nextPage = false) => {
    if (busy) return;
    setBusy(true);

    if (!nextPage) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    setError(null);

    try {
      if (!propertyId) {
        throw new Error("Property ID is required");
      }

      // Query: property match + bookingDate desc (uses existing Firestore index)
      // Use desc order to match existing Firestore index; we sort to asc (soonest first) in memory
      let bookingsQuery = query(
        collection(db, "bookings"),
        where("property.id", "==", propertyId),
        orderBy("bookingDate", "desc"),
        limit(LIMIT)
      );

      // Handle pagination with nextPage and lastVisible
      if (nextPage && lastVisible) {
        bookingsQuery = query(
          bookingsQuery,
          startAfter(lastVisible),
          limit(LIMIT)
        );
      }

      // Fetch the bookings
      const querySnapshot = await getDocs(bookingsQuery);
      const fetchedBookings = [];

      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ ...doc.data(), id: doc.id });
      });

      console.log(`Fetched ${fetchedBookings.length} bookings from network`);

      // If pagination, append the new bookings to the existing bookings
      if (nextPage) {
        setBookings((prevBookings) => {
          const updatedBookings = [...prevBookings, ...fetchedBookings];
          return sortDataBySlots(updatedBookings); // Sort the updated list
        });
      } else {
        setBookings(sortDataBySlots(fetchedBookings));
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.log("Error fetching bookings:", err.message);
      setError(err.message);
    } finally {
      if (!nextPage) {
        setLoading(false); // Hide page loader after initial load
      } else {
        setPaginationLoading(false); // Hide pagination loader
      }
      setBusy(false); // Reset busy flag after API call is completed
    }
  };

  // Add a new booking with slots
  const addSlotBooking = async (booking, slotsToBook) => {
    if (busy) return;
    setBusy(true);
    setLoading(true);
    try {
      const res = await addDoc(collection(db, "bookings"), booking);
      const bookingId = res.id;

      await Promise.all(
        slotsToBook.map(async (slot) => {
          const slotInfo = {
            slot,
            bookingId,
            bookingCancel: false,
            customer: booking.customer,
            ...(slot.courtId && { courtId: slot.courtId }),
          };

          const propertiesRef = collection(db, "properties");
          const bookingsRef = doc(propertiesRef, propertyId);
          const bookingsCollectionRef = collection(bookingsRef, "bookings");
          const date = booking?.bookingDate;
          const currentDateDocRef = doc(bookingsCollectionRef, date);
          const bookedSlotCollectionRef = collection(
            currentDateDocRef,
            "bookedSlot"
          );

          await addDoc(bookedSlotCollectionRef, slotInfo);
        })
      );
      await fetchBookings();

      console.log("Booking added successfully!");
      showAlert("Booking added successfully!!", "success");

      // Force fetching of bookings (no cache)
    } catch (e) {
      console.error("Error adding slot booking:", e);
      showAlert("Something went wrong while adding booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false);
    }
  };

  // Delete a slot booking
  const deleteSlotBooking = async (id, date, onComplete) => {
    if (busy) return;
    setBusy(true);
    setLoading(true);
    try {
      await deleteDoc(doc(db, "bookings", id));

      const propertiesRef = collection(db, "properties");
      const bookingsRef = doc(propertiesRef, propertyId);
      const bookingsCollectionRef = collection(bookingsRef, "bookings");
      const dateDocRef = doc(bookingsCollectionRef, date);
      const bookedSlotCollectionRef = collection(dateDocRef, "bookedSlot");

      const getDocsSnapshot = await getDocs(bookedSlotCollectionRef);
      getDocsSnapshot.forEach(async (doc) => {
        if (doc.data().bookingId === id) {
          await deleteDoc(doc.ref);
        }
      });

      await onComplete?.();

      console.log("Booking deleted successfully!");
      showAlert("Booking deleted successfully!!", "success");
    } catch (e) {
      console.error("Error deleting slot booking:", e);
      showAlert("Something went wrong while deleting booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false);
    }
  };

  // Update a booking
  const updateBooking = async (booking) => {
    if (busy) return;
    setBusy(true);
    setLoading(true);
    try {
      await setDoc(doc(db, "bookings", booking.id), booking);
      console.log("Booking updated successfully!");
      showAlert("Booking updated successfully!!", "success");
      fetchBookings(); // Refetch bookings after update
    } catch (e) {
      console.error("Error updating booking:", e);
      showAlert("Something went wrong while updating booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false);
    }
  };

  // Load more bookings (pagination)
  const loadMore = () => {
    if (busy) return;
    fetchBookings(true);
  };

  return {
    bookings,
    loading,
    paginationLoading,
    error,
    monthlyCollectionTotal,
    lastMonthCollectionTotal,
    addSlotBooking,
    deleteSlotBooking,
    updateBooking,
    loadMore,
    fetchBookings,
  };
};

export default useBookingsManager;
