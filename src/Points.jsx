import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { shareOnMobile } from "react-mobile-share";

import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { filter, includes, isEmpty, lowerCase, map } from "lodash";

const Points = () => {
  const [users, setUsers] = React.useState();
  const [updatedUsers, setUpdatedUsers] = React.useState();
  const [query, setQuery] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await getDocs(collection(db, "points")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(newData);
      setUpdatedUsers(newData);
      setQuery("");
      console.log(newData);
    });
  };

  const onUpdateEntry = async () => {
    try {
      const userRef = doc(db, "points", input?.id);
      await setDoc(
        userRef,
        {
          name: input?.name,
          number: input?.number,
          points: input.points,
        },
        { merge: true }
      );
      await fetchUsers();
      setLoading(false);
      setInput({});
      onClose();
      return;
    } catch (e) {
      setLoading(false);
      console.error(e);
      return;
    } finally {
      setLoading(false);
    }
  };

  const onAddEntry = async () => {
    setLoading(true);
    if (input?.id) {
      await onUpdateEntry();
      return;
    }
    const doesUserExist =
      filter(users, (u) => u?.number === input?.number)?.length > 0;
    if (doesUserExist) {
      alert(
        "User with this number already exist, please edit that user instead"
      );
      return;
    }

    try {
      await addDoc(collection(db, "points"), {
        ...input,
      });
      await fetchUsers();
      setLoading(false);
      setInput({});
      onClose();
    } catch (e) {
      setLoading(false);
      console.error("Error adding document: ", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (query === "") {
      setUpdatedUsers(users);
    } else {
      const updatedUsers = filter(
        users,
        (u) =>
          includes(u?.number, query) ||
          includes(lowerCase(u?.name), lowerCase(query))
      );
      setUpdatedUsers(updatedUsers);
    }
  }, [query, users]);

  return (
    <Flex
      scrollBehavior="auto"
      paddingTop={"10%"}
      paddingLeft={"10%"}
      paddingRight={"10%"}
      flexDirection={"column"}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="90%">
          <ModalHeader>Add New Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={input?.number}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  number: e?.target?.value,
                });
              }}
              placeholder="Phone Number"
            />
            <Input
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
              value={input?.points}
              onChange={(e) => {
                setInput({
                  ...input,
                  points: e?.target?.value,
                });
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
      <Box textAlign={"center"} fontSize={18}>
        Welcome To Runbhumi Mewar
      </Box>
      <Box textAlign={"center"} fontSize={20} mt={4}>
        Points Table
      </Box>

      <Flex mt={4} flexDirection={"column"}>
        <Flex
          flexDirection={"row"}
          justifyContent={"space-between"}
          mt={4}
          mb={2}>
          <Box>
            <Box fontSize={14}>Search</Box>
            <Box fontSize={14} mt={1} mb={1}>
              {`Total ${users?.length}`}
            </Box>
          </Box>
          <Box>
            <Button onClick={onOpen} colorScheme="blue">
              Add
            </Button>
          </Box>
        </Flex>

        <Input
          width={"100%"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search Phone Number / Name"
        />
      </Flex>
      {isEmpty(updatedUsers) ? (
        <Box textAlign={"center"} mt={12} mb={8}>
          No Data
        </Box>
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Action</Th>
                <Th>Name</Th>
                <Th>Points</Th>
                <Th isNumeric>Number</Th>
                <Th isNumeric>Share</Th>
              </Tr>
            </Thead>
            <Tbody>
              {map(updatedUsers, (user) => {
                return (
                  <Tr>
                    <Button
                      onClick={() => {
                        setInput(user);
                        onOpen();
                      }}
                      mt={2}>
                      Edit
                    </Button>
                    <Td>{user?.name}</Td>
                    <Td>{user?.points}</Td>
                    <Td isNumeric>{user?.number}</Td>
                    <Button
                      onClick={() => {
                        shareOnMobile({
                          title: `Hello! You have ${user?.points} Runbhumi Points available to be redeemed.`,
                        });
                      }}
                      mt={2}>
                      Share
                    </Button>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Button mb={32} onClick={onOpen} colorScheme="blue" mt={8}>
        Add New Entry
      </Button>
    </Flex>
  );
};

export default Points;
