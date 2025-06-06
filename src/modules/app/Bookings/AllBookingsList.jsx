import { useEffect } from "react";
import { Button, Flex, Box, useDisclosure, Spinner } from "@chakra-ui/react";
import { isEmpty, map } from "lodash";
import useStore from "../../../zustand/useStore";
import useBookingsManager, { LIMIT } from "../hooks/useBookingsManager";
import NoBookings from "./NoBookings";
import useCurrentProperty from "../hooks/useCurrentProperty";
import BookingCard from "./BookingCard";
import { Link } from "react-router-dom";

export default function AllBookingsList() {
  const { usersWithPoints } = useStore();
  const { loading, loadMore, bookings, fetchBookings } = useBookingsManager();
  const { property, propertyId } = useCurrentProperty();

  const noBookings = !loading && isEmpty(bookings);
  const title = property?.property?.title;

  const onComplete = async () => {
    await fetchBookings(false, true);
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
            mt={1}
            mb={2}>
            <Box />
            <Link to={`/home/property/${propertyId}/add-booking`}>
              <Button colorScheme="blue" alignSelf={"flex-end"}>
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
              {map(bookings, (singleBooking) => {
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
