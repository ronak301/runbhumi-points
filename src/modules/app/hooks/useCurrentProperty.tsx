import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment";

// Function to fetch booked slots for a given date and propertyId
const getBookedSlotsForDateAndPlayground = async (
  date: any,
  propertyId: any
) => {
  let slots: any = [];

  const slotsCollectionRef = collection(
    db,
    `properties/${propertyId}/bookings/${date}/bookedSlot`
  );

  const slotsQuerySnapshot = await getDocs(slotsCollectionRef);

  slotsQuerySnapshot.forEach((slotDoc) => {
    slots.push({ ...slotDoc.data(), id: slotDoc.id });
  });

  return slots;
};

const useCurrentProperty = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({ date: moment().format("YYYY-MM-DD") });

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");
  const propertyId = storedUser?.propertyId;

  const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    if (!propertyId) {
      setLoading(false); // No propertyId available, stop loading
      return;
    }

    // Function to check if cached data is still valid
    const isCacheValid = () => {
      const cachedData = JSON.parse(
        localStorage.getItem(`property-${propertyId}`) || "{}"
      );
      if (cachedData) {
        const { timestamp } = cachedData;
        // Check if the cached data is older than 24 hours
        return Date.now() - timestamp < CACHE_EXPIRY_TIME;
      }
      return false;
    };

    const fetchPropertyData = async () => {
      try {
        setLoading(true);

        // Check if cache is valid first
        if (isCacheValid()) {
          const cachedData = JSON.parse(
            localStorage.getItem(`property-${propertyId}`) || "{}"
          );

          // If cache is valid, set the state from cache
          if (cachedData) {
            setProperty(cachedData);
            console.log("Loaded property data from cache");
            setLoading(false);
            return; // Skip Firestore fetch if data is already in cache
          }
        }

        // If no valid cache, fetch from Firestore
        console.log("Fetching property data from Firestore...");
        const propertyRef = doc(db, "properties", propertyId);

        // Fetch property data
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
          // Get the property data
          const propertyData = propertyDoc.data();

          // Fetch the slots subcollection for this property
          const slotsRef = collection(propertyRef, "slots");
          const slotsSnapshot = await getDocs(slotsRef);
          let slotsData = slotsSnapshot.docs.map((doc) => doc.data());

          // Sort the slots by the `sort` field
          slotsData = slotsData.sort((a, b) => a.sort - b.sort);

          // Get the stored user data for the owner (assuming `storedUser` exists in your app)
          const owner = storedUser.owner;

          // Combine property info and slots data into one object
          const fullPropertyData = {
            property: propertyData,
            owner: owner,
          };

          // Cache the fetched data
          localStorage.setItem(
            `property-${propertyId}`,
            JSON.stringify({
              property: propertyData,
              slots: slotsData,
              owner: owner,
              timestamp: Date.now(),
            })
          );

          // Set the state with fetched and sorted data
          setProperty(fullPropertyData as any);
          console.log("Fetched and stored property data from Firestore");
        } else {
          console.log("Property not found in Firestore");
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]); // Re-run when the propertyId changes

  // Re-run whenever date or propertyId changes

  return {
    property,
    setInput,
    input,
    loading,
    propertyId,
  };
};

export default useCurrentProperty;
