import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";

export const getAllProperties = async () => {
  let prop = [];
  const allPropertiesDocs = query(collection(db, "properties"));

  const querySnapshot = await getDocs(allPropertiesDocs);

  querySnapshot.forEach((doc) => {
    prop.push({ ...doc.data(), id: doc.id, doc: doc });
  });
  return prop;
};

export const getAllSlots = async (doc) => {
  let slots = [];

  const slotsCollectionRef = collection(doc.ref, "slots");
  const slotsQuerySnapshot = await getDocs(slotsCollectionRef);

  slotsQuerySnapshot.forEach((slotDoc) => {
    slots.push({ ...slotDoc.data(), id: slotDoc.id });
  });

  slots.sort((a, b) => {
    return a.sort - b.sort;
  });

  return slots;
};

export const getBookedSlotsForDateAndPlayground = async (date, playground) => {
  let slots = [];

  const slotsCollectionRef = collection(
    playground.ref,
    `bookings/${date}/bookedSlot`
  );
  const slotsQuerySnapshot = await getDocs(slotsCollectionRef);

  slotsQuerySnapshot.forEach((slotDoc) => {
    slots.push({ ...slotDoc.data(), id: slotDoc.id });
  });

  return slots;
};
