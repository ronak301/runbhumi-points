import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const useCurrentProperty = () => {
  // State to hold the property and owner data
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") ?? "{}");

  useEffect(() => {
    // Get propertyId from localStorage

    const propertyId = storedUser?.propertyId;

    if (!propertyId) {
      return;
    }

    // Define the function to fetch property and owner data
    const fetchPropertyData = async () => {
      try {
        // Set loading to true while fetching
        setLoading(true);

        // Fetch property info
        const propertyRef = doc(db, "properties", propertyId);
        const propertyDoc = await getDoc(propertyRef);

        if (!propertyDoc.exists()) {
          return;
        }

        // Set property data
        setProperty(propertyDoc?.data() as any);

        // Fetch owner info (assuming the owner info is stored in a sub-collection or another document)

        // Set owner data
        setOwner(storedUser.owner);

        // Set loading to false after data has been fetched
        setLoading(false);
      } catch (err) {}
    };

    fetchPropertyData();
  }, []); // Empty dependency array to only run once on mount

  return { property, owner, loading, propertyId: storedUser.propertyId };
};

export default useCurrentProperty;
