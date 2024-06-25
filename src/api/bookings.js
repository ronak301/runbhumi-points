import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

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
  console.log("querySnapshot", querySnapshot);
  querySnapshot.forEach((doc) => {
    bookings.push({ ...doc.data(), id: doc.id });
  });
  return bookings;
};

export const addBooking = async (booking) => {
  await addDoc(collection(db, "bookings"), booking);
};

export const updateBooking = async (booking) => {
  await setDoc(doc(db, "bookings", booking.id), booking);
};
