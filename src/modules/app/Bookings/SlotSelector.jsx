import React, { memo } from "react";
import { filter, map } from "lodash";
import { Button, Grid, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import useCurrentProperty from "../hooks/useCurrentProperty";

function SlotSelector({
  setSelectedSlots,
  selectedSlots,
  bookedSlots,
  slotLoading,
}) {
  const { property } = useCurrentProperty();
  console.log("great3", property);
  const slots = property?.slots || property?.property?.slots;
  const t = property?.title || property?.property?.title;

  const getFormatted = (title) => {
    if (t === "RunBhumi Mewar") {
      return title?.toString();
    }
    const [start, end] = title.split(" - ");

    const formatTime = (time) => {
      let [hours, minutes] = time.split(":").map(Number);
      const suffix = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return minutes === 0
        ? `${hours}`
        : `${hours}:${minutes.toString().padStart(2, "0")}`;
    };

    return `${formatTime(start)} - ${formatTime(end)} ${
      start.split(":")[0] >= 12 ? "PM" : "AM"
    }`;
  };

  React.useEffect(() => {
    console.log("Updated bookedSlots:", bookedSlots);
  }, [bookedSlots]);

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

  return slotLoading ? (
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
              {getFormatted(slot.title)}
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
