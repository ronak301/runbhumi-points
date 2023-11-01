import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
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

import { collection, addDoc, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { filter, includes, map } from "lodash";

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

  const onAddEntry = async () => {
    const doesUserExist =
      filter(users, (u) => u?.number === input?.number)?.length > 0;
    if (doesUserExist) {
      alert(
        "User with this number already exist, please edit that user instead"
      );
      return;
    }
    setLoading(true);
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
    }
  };

  React.useEffect(() => {
    if (query === "") {
      setUpdatedUsers(users);
    } else {
      const updatedUsers = filter(
        users,
        (u) => includes(u?.number, query) || u?.name === query
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
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  number: e?.target?.value,
                });
              }}
              placeholder="Enter Phone Name"
            />
            <Input
              width={"100%"}
              mt={2}
              onChange={(e) => {
                setInput({
                  ...input,
                  name: e?.target?.value,
                });
              }}
              placeholder="Enter Name"
            />
            <Input
              mt={2}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  points: e?.target?.value,
                });
              }}
              placeholder="Enter Points"
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              isLoading={loading}
              colorScheme="blue"
              ml={3}
              onClick={onAddEntry}>
              Add
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
        <Box fontSize={14} mt={4} mb={1}>
          Search By Name or Phone Number
        </Box>
        <Box fontSize={14} mt={4} mb={1}>
          {`Total ${users?.length}`}
        </Box>
        <Input
          width={"100%"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Enter Phone Number / Name"
        />
      </Flex>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Points</Th>
              <Th isNumeric>Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {map(updatedUsers, (user) => {
              return (
                <Tr>
                  <Button mt={2}>Edit</Button>
                  <Td>{user?.name}</Td>
                  <Td>{user?.points}</Td>
                  <Td isNumeric>{user?.number}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Button mb={32} onClick={onOpen} colorScheme="blue" mt={8}>
        Add New Entry
      </Button>
    </Flex>
  );
};

export default Points;
