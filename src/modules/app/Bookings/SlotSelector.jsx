import React, { memo } from "react";
import {
  getAllProperties,
  getAllSlots,
  getBookedSlotsForDateAndPlayground,
} from "../api/slots";
import { filter, map } from "lodash";
import { Button, Grid, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";

function SlotSelector({ input, setSelectedSlots, selectedSlots }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [slots, setSlots] = React.useState([]);
  const [bookedSlots, setBookedSlots] = React.useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    getAllProperties().then((data) => {
      const playground = data[0].doc;
      getAllSlots(playground).then((allSlots) => {
        setSlots(allSlots);
      });
      getBookedSlotsForDateAndPlayground(
        input?.date || moment().format("YYYY-MM-DD"),
        playground
      ).then((currentDayBookedSlots) => {
        setBookedSlots(currentDayBookedSlots);
        setIsLoading(false);
      });
    });
  }, [input?.date]);

  const onClick = (slot) => {
    setSelectedSlots((prev) => {
      const isSlotAlreadySelected = filter(prev, (s) => s.title === slot.title);
      if (isSlotAlreadySelected.length > 0) {
        return filter(prev, (s) => s.title !== slot.title);
      } else {
        return [...prev, slot];
      }
    });
  };

  console.log("selectedSlots", selectedSlots);
  console.log("bookedSlots", bookedSlots);

  return isLoading ? (
    <Spinner />
  ) : (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {map(slots, (slot) => {
        const bookedByArray = filter(
          bookedSlots,
          (s) => s.slot.title === slot.title
        );
        const isSelected =
          filter(selectedSlots, (s) => s.title === slot.title)?.length > 0;
        const isBooked = bookedByArray?.length > 0;
        const backgroundColor = isBooked
          ? "#000"
          : isSelected
          ? "#3182CE"
          : "#fff";
        const borderColor = isBooked ? "#000" : "#000";
        const bookedBy = isBooked ? bookedByArray?.[0]?.customer?.name : "";
        const color = isBooked ? "#fff" : "#212121";
        return (
          <Button
            _hover={{}}
            onClick={() => onClick(slot)}
            isDisabled={isBooked}
            d="flex"
            flexDirection={"column"}
            borderRadius={"md"}
            height={"48px"}
            boxShadow="md"
            alignItems={"center"}
            justifyContent={"center"}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            border="1px solid">
            <Text fontSize={"12"} color={color}>
              {slot.title}
            </Text>
            {isBooked ? (
              <Text fontSize={"8"} color={color}>
                {`Booked - ${bookedBy}`}
              </Text>
            ) : null}
          </Button>
        );
      })}
    </Grid>
  );
}

export default memo(SlotSelector);
