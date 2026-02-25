import { Button, Flex, Box, Spinner, ButtonGroup } from "@chakra-ui/react";
import { isEmpty, map } from "lodash";
import useStore from "../../../zustand/useStore";
import useBookingsManager, { LIMIT } from "../hooks/useBookingsManager";
import NoBookings from "./NoBookings";
import useCurrentProperty from "../hooks/useCurrentProperty";
import BookingCard from "./BookingCard";
import { Link } from "react-router-dom";

import { useMemo, useState } from "react";

export default function AllBookingsList() {
  const { usersWithPoints } = useStore();
  const { loading, loadMore, bookings, fetchBookings } = useBookingsManager();
  const { property, propertyId } = useCurrentProperty();

  const noBookings = !loading && isEmpty(bookings);
  const title = property?.property?.title;

  const [filter, setFilter] = useState("all");
  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredBookings = useMemo(
    () =>
      filter === "today"
        ? bookings.filter((b) => b?.bookingDate === todayStr)
        : bookings,
    [bookings, filter, todayStr]
  );

  const onComplete = async () => {
    await fetchBookings();
  };

  return (
    <>
      <Flex
        scrollBehavior="auto"
        paddingLeft={"1%"}
        paddingRight={"1%"}
        minH={"70vh"}
        flexDirection={"column"}>
        <Flex mt={4} flexDirection={"column"}>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems="center"
            mt={1}
            mb={3}
            gap={3}>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                variant={filter === "all" ? "solid" : "outline"}
                colorScheme={filter === "all" ? "blue" : "gray"}
                onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "today" ? "solid" : "outline"}
                colorScheme={filter === "today" ? "blue" : "gray"}
                onClick={() => setFilter("today")}>
                Today
              </Button>
            </ButtonGroup>
            <Link to={`/home/property/${propertyId}/add-booking`}>
              <Button colorScheme="blue" alignSelf={"flex-end"} size="sm">
                Add Booking
              </Button>
            </Link>
          </Flex>
        </Flex>
        {loading ? (
          <Flex
            minH="100vh"
            justify="center"
            align="center"
            direction="column"
            p={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        ) : noBookings ? (
          <NoBookings />
        ) : (
          <>
            <Box>
              {map(filteredBookings, (singleBooking) => {
                return (
                  <BookingCard
                    key={singleBooking.id}
                    booking={singleBooking}
                    title={title}
                    usersWithPoints={usersWithPoints}
                    onComplete={onComplete}
                  />
                );
              })}
            </Box>
            {bookings?.length >= LIMIT ? (
              <Button mb={32} onClick={loadMore} colorScheme="blue" mt={8}>
                Load More
              </Button>
            ) : null}
          </>
        )}
      </Flex>
    </>
  );
}
