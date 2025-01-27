import { useState, useCallback } from "react";
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

const useBookingsManager = () => {
  const { propertyId } = useCurrentProperty();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [busy, setBusy] = useState(false); // State to track if an API call is in progress

  const sortDataBySlots = (data) => {
    return data?.sort((a, b) => {
      if (a?.bookingDate === b?.bookingDate) {
        const slotA = a?.slots?.[0];
        const slotB = b?.slots?.[0];
        return slotA.sort - slotB?.sort;
      } else {
        return new Date(b?.bookingDate) - new Date(a?.bookingDate);
      }
    });
  };

  const fetchBookings = async (fetchAll = false, nextPage = false) => {
    if (busy) return; // Prevent any further calls if an API call is in progress
    setBusy(true); // Set to true to indicate that a request is ongoing
    setLoading(true);
    setError(null);
    console.log("rkk2");

    // try {
    //   if (!propertyId) {
    //     throw new Error("Property ID is required");
    //   }

    //   // Define the query to filter bookings by property id in the nested property object
    //   let bookingsQuery = query(
    //     collection(db, "bookings"),
    //     where("property.id", "==", propertyId), // Updated to query by nested property.id
    //     orderBy("bookingDate", "desc"),
    //     limit(1)
    //   );

    //   // Handle pagination with nextPage and lastVisible
    //   if (nextPage && lastVisible) {
    //     bookingsQuery = query(
    //       bookingsQuery,
    //       startAfter(lastVisible),
    //       limit(1)
    //     );
    //   }

    //   // Fetch the bookings
    //   const querySnapshot = await getDocs(bookingsQuery);
    //   const bookings = [];

    //   // Iterate through querySnapshot to collect booking data
    //   querySnapshot.forEach((doc) => {
    //     bookings.push({ ...doc.data(), id: doc.id });
    //   });

    //   // Update the bookings state (considering whether we are loading more or not)
    //   setBookings((prevBookings) => {
    //     console.log("rkk", bookings);
    //     const data = nextPage ? [...prevBookings, ...bookings] : bookings;
    //     const sortedData = sortDataBySlots(data);
    //     return sortedData;
    //   });

    //   // Update the last visible document for pagination
    //   setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    // } catch (err) {
    //   console.log("err", err.message);
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    //   setBusy(false); // Reset busy flag after API call is completed
    // }
  };

  // Add a new booking with slots
  const addSlotBooking = async (booking, slotsToBook) => {
    if (busy) return; // Prevent further calls if an API call is in progress
    setBusy(true); // Set to true to indicate that a request is ongoing
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

      showAlert("Booking added successfully!!", "success");
      fetchBookings(); // Refetch bookings after adding
    } catch (e) {
      console.error("Error adding slot booking:", e);
      showAlert("Something went wrong while adding booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false); // Reset busy flag after API call is completed
    }
  };

  // Delete a slot booking
  const deleteSlotBooking = async (id, date) => {
    if (busy) return; // Prevent further calls if an API call is in progress
    setBusy(true); // Set to true to indicate that a request is ongoing
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

      showAlert("Booking deleted successfully!!", "success");
      fetchBookings(); // Refetch bookings after deletion
    } catch (e) {
      console.error("Error deleting slot booking:", e);
      showAlert("Something went wrong while deleting booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false); // Reset busy flag after API call is completed
    }
  };

  // Update a booking
  const updateBooking = async (booking) => {
    if (busy) return; // Prevent further calls if an API call is in progress
    setBusy(true); // Set to true to indicate that a request is ongoing
    setLoading(true);
    try {
      await setDoc(doc(db, "bookings", booking.id), booking);
      showAlert("Booking updated successfully!!", "success");
      fetchBookings(); // Refetch bookings after update
    } catch (e) {
      console.error("Error updating booking:", e);
      showAlert("Something went wrong while updating booking!!", "error");
    } finally {
      setLoading(false);
      setBusy(false); // Reset busy flag after API call is completed
    }
  };

  // Load more bookings (pagination)
  const loadMore = () => {
    if (busy) return; // Prevent further calls if an API call is in progress
    fetchBookings(false, true);
  };

  return {
    bookings,
    loading,
    error,
    addSlotBooking,
    deleteSlotBooking,
    updateBooking,
    loadMore,
    fetchBookings,
  };
};

export default useBookingsManager;
