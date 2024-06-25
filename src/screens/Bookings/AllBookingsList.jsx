import {
  Button,
  Flex,
  Box,
  Text,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import AddBookingModal from "./AddBookingModal";
import { map } from "lodash";
import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getAllBookings } from "../../api/bookings";
import moment from "moment";

export default function AllBookingsList() {
  const [bookings, setBookings] = React.useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = React.useState({});
  const [shouldFetchAllBookings, setShouldFetchAllBookings] =
    React.useState(false);

  React.useEffect(() => {
    // use await here
    getAllBookings(shouldFetchAllBookings).then((data) => {
      setBookings(data);
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

  return (
    <>
      <Flex
        backgroundColor={"rgb(247,245,238)"}
        scrollBehavior="auto"
        paddingLeft={"4%"}
        paddingRight={"4%"}
        flexDirection={"column"}>
        <AddBookingModal
          input={input}
          setInput={setInput}
          isOpen={isOpen}
          onClose={onClose}
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
        <>
          <Box>
            {map(bookings, (singleBooking) => {
              console.log("singleBooking", singleBooking);

              // append user's mobile number with 91 if its not already there.
              const num = String(singleBooking?.customer?.number);
              const updatedNumber = num?.startsWith("91") ? num : `91${num}`;
              const name = singleBooking?.customer?.name;

              return (
                <Box
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
                    <Text fontWeight={"500"} fontSize={16} px={1}>
                      {getSlotsInfo(singleBooking)}
                    </Text>
                    <Text fontWeight={"500"} fontSize={16} px={1}>
                      {moment(singleBooking?.bookingDate).format("DD-MMM")}
                    </Text>
                  </Flex>
                  <Text>{num}</Text>

                  <Flex justifyContent={"space-between"} mt={4}>
                    <Box>
                      <IconButton
                        onClick={() => {
                          const message = `Hello !! You have *xx Runbhumi Points* associated with mobile number -`;
                          window.open(
                            `https://wa.me/${updatedNumber}?text=${message}`,
                            "_blank"
                          );
                        }}
                        isRound
                        mr={2}
                        colorScheme="green"
                        aria-label="Share"
                        icon={<ExternalLinkIcon />}
                      />
                      <IconButton
                        isRound
                        onClick={() => {
                          //   setInput(user);
                          //   onOpen();
                        }}
                        colorScheme="blue"
                        aria-label="Edit"
                        icon={<EditIcon />}
                      />
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
      </Flex>
    </>
  );
}
