import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  orderBy,
  query,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { showAlert } from "../context/AlertContext";

export const getAllBookings = async (fetchAll = false) => {
  const limitedBookings = query(
    collection(db, "bookings"),
    orderBy("bookingDate", "desc"),
    limit(20)
  );
  const allBookings = query(
    collection(db, "bookings"),
    orderBy("bookingDate", "desc")
  );

  const bookingsToFetch = fetchAll ? allBookings : limitedBookings;
  const bookings = [];
  const querySnapshot = await getDocs(bookingsToFetch);
  querySnapshot.forEach((doc) => {
    bookings.push({ ...doc.data(), id: doc.id });
  });
  return bookings;
};

export const addSlotBooking = async (booking, slotsToBook) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  try {
    const res = await addDoc(collection(db, "bookings"), booking);
    console.log("Document written with ID: ", res.id);
    const bookingId = res.id;

    slotsToBook.forEach(async (slot) => {
      let slotInfo = {
        slot: slot,
        bookingId: bookingId,
        bookingCancel: false,
        customer: booking.customer,
      };
      const propertiesRef = collection(db, "properties");
      const bookingsRef = doc(propertiesRef, "iNANAwfMb6EXNtp7MRwJ");
      const bookingsCollectionRef = collection(bookingsRef, "bookings");
      const date = booking?.bookingDate;
      const currentDateDocRef = doc(bookingsCollectionRef, date);
      const bookedSlotCollectionRef = collection(
        currentDateDocRef,
        "bookedSlot"
      );

      try {
        const response = await addDoc(bookedSlotCollectionRef, slotInfo);
        console.log("Slot added with ID: ", response.id);
      } catch (e) {
        console.error("Error is while adding slot", e);
      }
    });
    showAlert("Booking added successfully!!", "success");
  } catch (e) {
    console.error("Error is", e);
    showAlert("Something went wrong while doing booking!!", "error");
  }
};

export const deleteSlotBooking = async (id, date) => {
  await deleteDoc(doc(db, "bookings", id));
  const propertiesRef = collection(db, "properties");
  const bookingsRef = doc(propertiesRef, "iNANAwfMb6EXNtp7MRwJ");
  const bookingsCollectionRef = collection(bookingsRef, "bookings");
  const dateDocRef = doc(bookingsCollectionRef, date);
  const bookedSlotCollectionRef = collection(dateDocRef, "bookedSlot");
  const getDocsSnapshot = await getDocs(bookedSlotCollectionRef);
  await getDocsSnapshot.forEach((doc) => {
    if (doc.data().bookingId === id) {
      deleteDoc(doc.ref);
    }
  });
  showAlert("Booking deleted successfully!!", "success");
};

export const updateBooking = async (booking) => {
  await setDoc(doc(db, "bookings", booking.id), booking);
};
