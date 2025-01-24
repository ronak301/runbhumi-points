import {
  Button,
  Flex,
  Box,
  Text,
  IconButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import AddBookingModal from "./AddBookingModal";
import { map } from "lodash";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getAllBookings } from "../../../api/bookings";
import moment from "moment";
import { DeleteBooking } from "../../../components/DeleteBooking";
import useStore from "../../../zustand/useStore";
import { getPoints, isValidPoints } from "../Points/Points";

const sortDataBySlots = (data) => {
  console.log("datadata", data);
  return data?.sort((a, b) => {
    if (a?.bookingDate === b?.bookingDate) {
      const slotA = a?.slots?.[0];
      const slotB = b?.slots?.[0];
      return slotA.sort - slotB?.sort;
    } else {
      return new Date(b?.bookingDate) - new Date(a?.bookingDate);
    }
  });
};

export default function AllBookingsList() {
  const [isLoaing, setIsLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { usersWithPoints } = useStore();

  const [shouldFetchAllBookings, setShouldFetchAllBookings] =
    React.useState(false);

  const fetchBookings = () => {
    setIsLoading(true);
    getAllBookings(shouldFetchAllBookings).then((data) => {
      console.log("dataaaa", data);
      setBookings(sortDataBySlots(data));
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    setIsLoading(true);
    getAllBookings(shouldFetchAllBookings).then((data) => {
      setBookings(sortDataBySlots(data));
      setIsLoading(false);
    });
  }, [shouldFetchAllBookings]);

  const getSlotsInfo = (booking) => {
    const slots = booking?.slots;
    const slotsInfo = slots.map((slot) => {
      return slot.title;
    });
    const info = slotsInfo.join(", ");

    const matches = [...info.matchAll(/-/g)];
    const indexes = matches.map((match) => match.index);
    if (indexes.length === 1) {
      return info;
    } else {
      const start = indexes[0];
      const end = indexes[indexes.length - 1];
      return info.slice(0, start) + info.slice(end);
    }
  };

  console.log("bookings", bookings);

  return (
    <>
      <Flex
        backgroundColor={"rgb(247,245,238)"}
        scrollBehavior="auto"
        paddingLeft={"4%"}
        paddingRight={"4%"}
        flexDirection={"column"}>
        <AddBookingModal
          isOpen={isOpen}
          onClose={onClose}
          fetchBookings={fetchBookings}
        />
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
        {isLoaing ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <>
            <Box>
              {map(bookings, (singleBooking) => {
                // append user's mobile number with 91 if its not already there.
                const num = String(singleBooking?.customer?.number);
                const updatedNumber = num?.startsWith("91") ? num : `91${num}`;
                const name = singleBooking?.customer?.name;
                const advancedAmountString = singleBooking?.amountSumary
                  ?.advanced
                  ? `Advance Recieved: Rs. ${singleBooking?.amountSumary?.advanced}`
                  : "";
                const linkedUser = usersWithPoints.find(
                  // last 10 digits of both numbers should be same after removing any spaces
                  (user) =>
                    user?.number?.replace(/\s/g, "").slice(-10) ===
                    num?.replace(/\s/g, "").slice(-10)
                );

                const pointsAvailable = isValidPoints(linkedUser)
                  ? getPoints(linkedUser?.points)
                  : 0;

                return (
                  <Box
                    key={singleBooking.id}
                    boxShadow="md"
                    backgroundColor={"white"}
                    mt={2}
                    mb={2}
                    pb={4}
                    pl={4}
                    pr={4}
                    borderRadius={8}
                    pt={4}>
                    <Flex
                      d="flex"
                      justifyContent={"space-between"}
                      flexDirection={"row"}>
                      <Text fontSize={16} fontWeight={"700"}>
                        {name}
                      </Text>
                      <Flex>
                        <Text fontWeight={"500"} fontSize={16} px={1}>
                          {getSlotsInfo(singleBooking)}
                        </Text>
                        <Text fontWeight={"500"} ml={2} fontSize={16} px={1}>
                          {moment(singleBooking?.bookingDate).format(
                            "DD-MM-YYYY"
                          )}
                        </Text>
                      </Flex>
                    </Flex>
                    <Text>{num}</Text>

                    <Flex justifyContent={"space-between"} mt={4}>
                      <DeleteBooking
                        booking={singleBooking}
                        fetchBookings={fetchBookings}
                      />
                      <Box>
                        <IconButton
                          onClick={() => {
                            const message = `
*🏏Runbhumi Mewar Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location - F-266, Road No. 12, Near Airtel Office, Madri Industrial Area
Map: https://maps.app.goo.gl/QAs3A9APjdqRZfmS9
Date of Booking: ${moment(singleBooking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(singleBooking)}
*Total Amount: Rs. ${singleBooking?.amountSumary?.total}*
${advancedAmountString}
Points Available: ${pointsAvailable}

                          `;
                            window.open(
                              `https://api.whatsapp.com/send/?phone=${updatedNumber}&text=${encodeURIComponent(
                                message
                              )}`,
                              "_blank"
                            );
                          }}
                          isRound
                          // mr={2}
                          colorScheme="green"
                          aria-label="Share"
                          icon={<ExternalLinkIcon />}
                        />
                        {/* <IconButton
                        isRound
                        onClick={() => {
                          //   setInput(user);
                          //   onOpen();
                        }}
                        colorScheme="blue"
                        aria-label="Edit"
                        icon={<EditIcon />}
                      /> */}
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Box>
            <Button
              mb={32}
              onClick={() => {
                setShouldFetchAllBookings(true);
              }}
              colorScheme="blue"
              mt={8}>
              Load All
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}
