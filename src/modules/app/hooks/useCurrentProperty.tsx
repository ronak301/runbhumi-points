import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const useCurrentProperty = () => {
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");

  const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    const propertyId = storedUser?.propertyId;
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

        // Check cache first
        if (isCacheValid()) {
          const cachedData = JSON.parse(
            localStorage.getItem(`property-${propertyId}`) || "{}"
          );
          setProperty(cachedData.property);
          setOwner(cachedData.owner);
          setLoading(false);
          return; // Skip fetching from Firestore if cache is valid
        }

        // Fetch from Firestore if no valid cache
        console.log("fetching prop info");
        const propertyRef = doc(db, "properties", propertyId);
        const propertyDoc = await getDoc(propertyRef);

        if (propertyDoc.exists()) {
          // Save the data in cache with a timestamp
          localStorage.setItem(
            `property-${propertyId}`,
            JSON.stringify({
              property: propertyDoc.data(),
              owner: storedUser.owner, // Assuming owner is stored in the user data
              timestamp: Date.now(),
            })
          );

          // Set the property and owner state
          setProperty(propertyDoc.data() as any);
          setOwner(storedUser.owner);
        } else {
          console.log("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [storedUser?.propertyId]); // Re-run when the propertyId changes

  return { property, owner, loading, propertyId: storedUser?.propertyId };
};

export default useCurrentProperty;
