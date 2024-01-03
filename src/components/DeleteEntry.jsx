import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DeleteIcon } from "@chakra-ui/icons";

export function DeleteEntry({ user, fetchUsers }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const onDeleteEntry = () => {
    deleteDoc(doc(db, "points", user?.id));
    fetchUsers();
    onClose();
  };

  return (
    <>
      <Box>
        <IconButton
          onClick={() => {
            onOpen();
          }}
          isRound
          colorScheme="red"
          aria-label="Delete"
          icon={<DeleteIcon />}
        />
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent mr={4} ml={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete user?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDeleteEntry} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
