import { Button, Flex, Box, useDisclosure, Spinner } from "@chakra-ui/react";
import AddBookingModal from "./AddBookingModal";
import { isEmpty, map } from "lodash";
import useStore from "../../../zustand/useStore";
import useBookingsManager from "../hooks/useBookingsManager";
import NoBookings from "./NoBookings";
import useCurrentProperty from "../hooks/useCurrentProperty";
import BookingCard from "./BookingCard";

export default function AllBookingsList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { usersWithPoints } = useStore();
  const { loading, loadMore, bookings } = useBookingsManager();
  const { property } = useCurrentProperty();

  const noBookings = !loading && isEmpty(bookings);
  const title = property?.property?.title;

  return (
    <>
      <Flex
        scrollBehavior="auto"
        paddingLeft={"4%"}
        paddingRight={"4%"}
        minH={"70vh"}
        flexDirection={"column"}>
        <AddBookingModal isOpen={isOpen} onClose={onClose} />
        <Flex mt={4} flexDirection={"column"}>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            mt={1}
            mb={2}>
            <Box />
            <Button
              onClick={() => {
                onOpen();
              }}
              colorScheme="blue"
              alignSelf={"flex-end"}>
              Add Booking
            </Button>
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
                  />
                );
              })}
            </Box>
            <Button mb={32} onClick={loadMore} colorScheme="blue" mt={8}>
              Load More
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}
