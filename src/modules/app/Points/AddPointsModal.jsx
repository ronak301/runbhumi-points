import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
} from "@chakra-ui/react";

export default function AddPointsModal({
  isOpen,
  onClose,
  isUpdating,
  input,
  setInput,
  loading,
  onAddEntry,
  setPoints,
  getPoints,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="90%">
        <ModalHeader>{isUpdating ? "Update" : "Add New Member"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            disabled={!!isUpdating}
            value={input?.number}
            width={"100%"}
            onChange={(e) => {
              if (input?.number?.length >= 10) return;
              setInput({
                ...input,
                number: e?.target?.value,
              });
            }}
            maxLength={10}
            type="number"
            placeholder="Phone Number"
          />
          <Input
            disabled={!!isUpdating}
            width={"100%"}
            value={input?.name}
            mt={2}
            onChange={(e) => {
              setInput({
                ...input,
                name: e?.target?.value,
              });
            }}
            placeholder="Name"
          />
          <Input
            mt={2}
            width={"100%"}
            defaultValue={getPoints(input?.points)}
            onChange={(e) => {
              setPoints(e?.target?.value);
            }}
            placeholder="Points"
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            isLoading={loading}
            colorScheme="blue"
            ml={3}
            onClick={onAddEntry}>
            {input?.id ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
