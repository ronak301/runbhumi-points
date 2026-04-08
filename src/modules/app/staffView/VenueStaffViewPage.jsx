import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import moment from "moment";
import { db } from "../../../firebase";
import { getSlotsSummary } from "../Bookings/bookingDisplay";
import { compareBookingsBySlotTimeAsc } from "../Bookings/bookingSort";

function sortBySlotTime(bookings) {
  return [...bookings].sort(compareBookingsBySlotTimeAsc);
}

/** @param {string | undefined} courtId e.g. court1 */
function courtTabLabel(courtId) {
  const n = String(courtId || "").replace(/^court/i, "").trim();
  return n ? `Court ${n}` : String(courtId || "Court");
}

/** Booking counts if it has at least one slot on this court. */
function bookingMatchesCourt(booking, courtId) {
  const raw = booking?.slots || [];
  if (!raw.length) return (courtId || "court1") === "court1";
  for (const s of raw) {
    const slot = s?.slot && typeof s.slot === "object" ? s.slot : s;
    const cid = slot?.courtId || "court1";
    if (cid === courtId) return true;
  }
  return false;
}

async function fetchBookingsForPropertyOnDate(propertyId, dateStr) {
  const q = query(
    collection(db, "bookings"),
    where("property.id", "==", propertyId),
    where("bookingDate", "==", dateStr)
  );
  const snap = await getDocs(q);
  const rows = [];
  snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
  return rows;
}

async function fetchCourtsList(propertyId) {
  const propSnap = await getDoc(doc(db, "properties", propertyId));
  const fromDoc = propSnap.data()?.courts;
  if (Array.isArray(fromDoc) && fromDoc.length > 0) return fromDoc;
  const slotsSnap = await getDocs(
    collection(db, "properties", propertyId, "slots")
  );
  const ids = new Set();
  slotsSnap.forEach((d) => {
    const cid = d.data()?.courtId;
    if (cid) ids.add(cid);
  });
  const arr = Array.from(ids).sort();
  return arr.length > 0 ? arr : ["court1"];
}

function StaffBookingCard({ booking, propertyId }) {
  const name = booking?.customer?.name;
  const num = booking?.customer?.number;
  const totalAmount = booking?.amountSumary?.total ?? 0;
  const formattedTotal = Number(totalAmount).toLocaleString("en-IN");
  const discountAmount = Number(booking?.amountSumary?.discount) || 0;
  const advancedAmount = Number(booking?.amountSumary?.advanced) || 0;
  const displayDate = moment(booking?.bookingDate).format("DD MMM YYYY");
  const slotsLine = getSlotsSummary(booking, propertyId);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      backgroundColor="white"
      mb={3}
      px={3}
      py={3}
      boxShadow="sm">
      <Flex justifyContent="space-between" align="center" mb={2} gap={2}>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight="600" color="teal.700" mb={0.5}>
            {name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {num}
          </Text>
        </Box>
        <Text fontSize="sm" fontWeight="700" color="teal.700" flexShrink={0}>
          ₹{formattedTotal}
        </Text>
      </Flex>
      <Text fontSize="xs" color="gray.700">
        {displayDate} · {slotsLine}
      </Text>
      {discountAmount > 0 && (
        <Text fontSize="xs" color="orange.600" mt={1}>
          Discount: ₹{discountAmount.toLocaleString("en-IN")}
        </Text>
      )}
      {advancedAmount > 0 && (
        <Text fontSize="xs" color="gray.600" mt={1}>
          Advanced: ₹{advancedAmount.toLocaleString("en-IN")}
        </Text>
      )}
    </Box>
  );
}

function BookingList({ list, propertyId, empty }) {
  if (!list.length) {
    return (
      <Text color="gray.500" fontSize="sm" py={6} textAlign="center">
        {empty}
      </Text>
    );
  }
  return (
    <VStack align="stretch" spacing={0}>
      {list.map((b) => (
        <StaffBookingCard key={b.id} booking={b} propertyId={propertyId} />
      ))}
    </VStack>
  );
}

export default function VenueStaffViewPage() {
  const { token, propertyId: propertyIdParam } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueTitle, setVenueTitle] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState(null);
  const [courtFilter, setCourtFilter] = useState("all");

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const tomorrowStr = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        let pid = propertyIdParam || null;
        let title = "Venue";

        // Backwards-compatible: if opened via token URL, resolve propertyId from staffViewLinks.
        if (!pid) {
          if (!token) {
            setError("Invalid link.");
            setLoading(false);
            return;
          }
          const linkSnap = await getDoc(doc(db, "staffViewLinks", token));
          if (!linkSnap.exists()) {
            setError("This link is not valid or was removed.");
            setLoading(false);
            return;
          }
          const linkData = linkSnap.data();
          pid = linkData?.propertyId || null;
          title = linkData?.venueTitle || "Venue";
        }

        if (!pid) {
          setError("Missing property.");
          setLoading(false);
          return;
        }

        // Static mode: load venue title from property doc (source of truth).
        if (propertyIdParam) {
          try {
            const propSnap = await getDoc(doc(db, "properties", pid));
            title =
              propSnap.data()?.property?.title ||
              propSnap.data()?.title ||
              "Venue";
          } catch {
            // ignore
          }
        }

        if (cancelled) return;
        setPropertyId(pid);
        setVenueTitle(title || "Venue");
        setCourtFilter("all");
        try {
          const courtList = await fetchCourtsList(pid);
          if (!cancelled) setCourts(courtList);
        } catch {
          if (!cancelled) setCourts(["court1"]);
        }

        // Source of truth: the same `bookings` collection used by the portal.
        const [todayRows, tomorrowRows] = await Promise.all([
          fetchBookingsForPropertyOnDate(pid, todayStr),
          fetchBookingsForPropertyOnDate(pid, tomorrowStr),
        ]);
        const rows = [...todayRows, ...tomorrowRows];
        if (cancelled) return;
        setBookings(rows);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Could not load bookings. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token, propertyIdParam, todayStr, tomorrowStr]);

  const showCourtFilter = Array.isArray(courts) && courts.length > 1;

  const todayBookings = useMemo(
    () =>
      sortBySlotTime(bookings.filter((b) => b.bookingDate === todayStr)),
    [bookings, todayStr]
  );
  const tomorrowBookings = useMemo(
    () =>
      sortBySlotTime(bookings.filter((b) => b.bookingDate === tomorrowStr)),
    [bookings, tomorrowStr]
  );

  const filteredTodayBookings = useMemo(() => {
    if (!showCourtFilter || courtFilter === "all") return todayBookings;
    return todayBookings.filter((b) => bookingMatchesCourt(b, courtFilter));
  }, [todayBookings, showCourtFilter, courtFilter]);

  const filteredTomorrowBookings = useMemo(() => {
    if (!showCourtFilter || courtFilter === "all") return tomorrowBookings;
    return tomorrowBookings.filter((b) => bookingMatchesCourt(b, courtFilter));
  }, [tomorrowBookings, showCourtFilter, courtFilter]);

  const shortToday = moment(todayStr).format("D MMM");
  const shortTomorrow = moment(tomorrowStr).format("D MMM");

  return (
    <Box minH="100vh" bg="gray.50" pb={8}>
      <Box
        backgroundColor="rgb(20,20,20)"
        minHeight="60px"
        display="flex"
        alignItems="center"
        px={4}
        py={2}
        boxShadow="sm">
        <Text fontSize="lg" color="white" fontWeight="bold" noOfLines={2}>
          {venueTitle || "Venue"} · Staff view
        </Text>
      </Box>

      <Text fontSize="xs" color="gray.600" px={4} pt={2} pb={0}>
        View only
      </Text>

      {loading ? (
        <Flex justify="center" align="center" minH="40vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : error ? (
        <Text color="red.600" px={4} pt={4}>
          {error}
        </Text>
      ) : (
        <Tabs colorScheme="blue" size="sm" px={2} pt={1} isLazy>
          {showCourtFilter && (
            <Flex
              role="group"
              aria-label="Filter by court"
              px={1}
              pt={2}
              pb={1}
              gap={1.5}
              flexWrap="wrap"
              align="center">
              <Text fontSize="xs" color="gray.500" fontWeight="600" mr={1}>
                Court
              </Text>
              <Button
                size="xs"
                variant={courtFilter === "all" ? "solid" : "outline"}
                colorScheme="blue"
                fontWeight="600"
                onClick={() => setCourtFilter("all")}>
                All
              </Button>
              {courts.map((cid) => (
                <Button
                  key={cid}
                  size="xs"
                  variant={courtFilter === cid ? "solid" : "outline"}
                  colorScheme="blue"
                  fontWeight="600"
                  onClick={() => setCourtFilter(cid)}>
                  {courtTabLabel(cid)}
                </Button>
              ))}
            </Flex>
          )}
          <TabList
            w="100%"
            flexWrap="nowrap"
            gap={0}
            borderBottomWidth="1px"
            borderColor="gray.200">
            <Tab
              flex="1"
              minW={0}
              fontSize="xs"
              fontWeight="600"
              py={2}
              px={1}
              whiteSpace="nowrap"
              textAlign="center"
              lineHeight="1.2">
              Today · {shortToday} · {filteredTodayBookings.length}
            </Tab>
            <Tab
              flex="1"
              minW={0}
              fontSize="xs"
              fontWeight="600"
              py={2}
              px={1}
              whiteSpace="nowrap"
              textAlign="center"
              lineHeight="1.2">
              Tomorrow · {shortTomorrow} · {filteredTomorrowBookings.length}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={1}>
              <BookingList
                list={filteredTodayBookings}
                propertyId={propertyId}
                empty="No bookings for today."
              />
            </TabPanel>
            <TabPanel px={1}>
              <BookingList
                list={filteredTomorrowBookings}
                propertyId={propertyId}
                empty="No bookings for tomorrow."
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
}
