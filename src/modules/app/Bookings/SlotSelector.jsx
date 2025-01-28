import React, { memo } from "react";
import { filter, map } from "lodash";
import { Button, Grid, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import useCurrentProperty from "../hooks/useCurrentProperty";

function SlotSelector({ setSelectedSlots, selectedSlots }) {
  const { property, bookedSlots: propBookedSlots } = useCurrentProperty();
  const slots = property?.slots;
  const bookedSlots = propBookedSlots;
  const isLoading = false;
  console.log("bookedSlots", propBookedSlots);

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
