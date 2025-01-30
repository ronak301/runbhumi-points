import { useState, useEffect } from "react";
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

const useBookingsManager = () => {
  const { propertyId } = useCurrentProperty();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false); // Initial loading
  const [paginationLoading, setPaginationLoading] = useState(false); // Pagination loading
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

  // Function to load bookings from cache
  const loadBookingsFromCache = () => {
    const cachedData = localStorage.getItem("bookings");
    const cachedTimestamp = localStorage.getItem("bookingsTimestamp");
    const currentTime = new Date().getTime();

    // Check if cache is available and is not older than 24 hours
    if (cachedData && cachedTimestamp) {
      const cacheAge = currentTime - cachedTimestamp;
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (cacheAge < twentyFourHours) {
        console.log("Loaded bookings from cache");
        setBookings(JSON.parse(cachedData)); // Load cached bookings if within 24 hours
        return true; // Cache is valid, skip fetching from Firestore
      }
    }

    console.log("Cache expired or not found, fetching from network...");
    return false; // Cache expired or not available, need to fetch from Firestore
  };

  // Load initial bookings from cache or Firestore
  useEffect(() => {
    // Try loading from cache first
    const cacheLoaded = loadBookingsFromCache();

    if (!cacheLoaded) {
      fetchBookings(); // If cache expired or not present, fetch from Firestore
    }
  }, []);

  const fetchBookings = async (nextPage = false, forceFetch = false) => {
    if (busy) return; // Prevent any further calls if an API call is in progress
    setBusy(true); // Set to true to indicate that a request is ongoing

    // Differentiate between initial load and pagination
    if (!nextPage) {
      setLoading(true); // Show page loader for the initial load
    } else {
      setPaginationLoading(true); // Show pagination loader for additional data
    }

    setError(null);

    const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    try {
      if (!propertyId) {
        throw new Error("Property ID is required");
      }

      // Skip cache and force data fetch if forceFetch is true
      if (!forceFetch) {
        // Check if cached data is available and if it's still valid (within 24 hours)
        const cachedBookings = JSON.parse(localStorage.getItem("bookings"));
        const cachedTimestamp = localStorage.getItem("bookingsTimestamp");
        const isCacheValid =
          cachedBookings &&
          cachedTimestamp &&
          Date.now() - cachedTimestamp < CACHE_EXPIRY_TIME;

        if (isCacheValid && !nextPage) {
          // If cache is valid and it's not a pagination request, use the cache
          console.log("Serving bookings from cache");
          setBookings(cachedBookings); // Set the state from cached data
          setLoading(false); // Hide page loader
          setBusy(false);
          return;
        }
      }

      // Define the query to filter bookings by property id in the nested property object
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
        // If it's the initial load, replace the bookings with the new data
        setBookings(fetchedBookings); // Set new bookings
      }

      // Update the timestamp for cache expiry
      localStorage.setItem("bookings", JSON.stringify(fetchedBookings)); // Cache the new data
      localStorage.setItem("bookingsTimestamp", new Date().getTime());

      // Update the lastVisible document for pagination
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
      await fetchBookings(false, true); // Force fresh data (no cache)

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
    addSlotBooking,
    deleteSlotBooking,
    updateBooking,
    loadMore,
    fetchBookings,
  };
};

export default useBookingsManager;
