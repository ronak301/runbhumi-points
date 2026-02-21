import React, { memo } from "react";
import { filter, map } from "lodash";
import { Button, Grid, Spinner, Text, Tabs, TabList, Tab } from "@chakra-ui/react";
import useCurrentProperty from "../hooks/useCurrentProperty";

function SlotSelector({
  setSelectedSlots,
  selectedSlots,
  bookedSlots,
  slotLoading,
  selectedCourt,
  onCourtChange,
}) {
  const { property } = useCurrentProperty();
  const allSlots = property?.slots || property?.property?.slots || [];
  const courts = property?.courts || ["court1"];
  const isMultiCourt = courts.length > 1;

  const slots = isMultiCourt
    ? filter(allSlots, (s) => (s.courtId || "court1") === selectedCourt)
    : allSlots;

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

  const onClick = (slot) => {
    setSelectedSlots((prev) => {
      const matchSlot = (a, b) =>
        a.title === b.title &&
        (a.courtId || "court1") === (b.courtId || "court1");
      const isSlotAlreadySelected = filter(prev, (s) => matchSlot(s, slot));
      if (isSlotAlreadySelected.length > 0) {
        return filter(prev, (s) => !matchSlot(s, slot));
      } else {
        return [...prev, slot];
      }
    });
  };

  const slotIsBooked = (slot, bookedSlotsList) => {
    return filter(bookedSlotsList, (s) => {
      const titleMatch = s.slot?.title === slot.title;
      const courtMatch =
        !s.courtId && !slot.courtId
          ? true
          : (s.courtId || "court1") === (slot.courtId || "court1");
      return titleMatch && courtMatch;
    });
  };

  return slotLoading ? (
    <Spinner />
  ) : (
    <>
      {isMultiCourt && (
        <Tabs
          index={courts.indexOf(selectedCourt)}
          onChange={(i) => onCourtChange?.(courts[i])}
          mb={4}>
          <TabList>
            {map(courts, (courtId, i) => (
              <Tab key={courtId}>Court {i + 1}</Tab>
            ))}
          </TabList>
        </Tabs>
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {map(slots, (slot) => {
          const bookedByArray = slotIsBooked(slot, bookedSlots);
        const isSelected =
          filter(
            selectedSlots,
            (s) =>
              s.title === slot.title &&
              (s.courtId || "court1") === (slot.courtId || "court1")
          )?.length > 0;
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
    </>
  );
}

export default memo(SlotSelector);
