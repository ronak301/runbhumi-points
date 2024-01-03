import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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
import {
  filter,
  forEach,
  includes,
  isEmpty,
  lowerCase,
  map,
  reduce,
} from "lodash";
import { DeleteIcon, EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getDateFormat } from "./utils/date";
import * as moment from "moment";

export const VALID_TILL_DURATION = 20;

// type User = {
//   name: string;
//   points: string;
//   number: string;
//   validTill: string;
// };

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

  const getValidTill = () => {
    return moment(new Date())
      .add(VALID_TILL_DURATION, "days")
      .format("YYYY-MM-DD");
  };

  const fetchUsers = async () => {
    await getDocs(collection(db, "points")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(newData);
      setUpdatedUsers(newData);
      setQuery("");
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
          validTill: getValidTill(),
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
        validTill: getValidTill(),
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

  const totalPoints = reduce(users, (acc, u) => (acc += Number(u?.points)), 0);

  return (
    <>
      <Box
        backgroundColor={"rgb(20,20,20)"}
        paddingTop={"10%"}
        paddingBottom={"6%"}
        borderRadius={8}
        overflow={"visible"}>
        <Box textAlign={"center"} fontSize={24} color={"white"}>
          Welcome To Runbhumi Mewar
        </Box>
        <Box textAlign={"center"} fontSize={20} mt={4} color={"white"}>
          Points Table
        </Box>
      </Box>

      <Flex
        backgroundColor={"rgb(247,245,238)"}
        scrollBehavior="auto"
        paddingLeft={"4%"}
        paddingRight={"4%"}
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

        <Flex mt={4} flexDirection={"column"}>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            mt={4}
            mb={2}>
            <Box>
              <Box fontSize={14} mt={1} mb={1}>
                {`Total Users - ${users?.length}`}
              </Box>
              <Box fontSize={14} mt={1} mb={1}>
                {`Total Points -  ${totalPoints}`}
              </Box>
              <Box fontSize={14} mt={1} mb={1}>
                {`Valid Till Duration (in days) - ${VALID_TILL_DURATION}`}
              </Box>
            </Box>
            <Box>
              <Button onClick={onOpen} colorScheme="blue">
                Add
              </Button>
            </Box>
          </Flex>
          <Box fontSize={14} mb={2}>
            Search
          </Box>
          <Input
            autoFocus
            borderColor={"black"}
            height={12}
            mb={4}
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
          <>
            <Box>
              {map(updatedUsers, (user) => {
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
                      <Text fontSize={18} fontWeight={"700"}>
                        {user?.name}
                      </Text>
                      <Text fontWeight={"700"} fontSize={22}>
                        {`${user?.points}`}
                      </Text>
                    </Flex>
                    <Text>{user?.number}</Text>
                    <Text color="gray.700">{`Valid Till ${getDateFormat(
                      user?.validTill
                    )}`}</Text>
                    <Flex justifyContent={"space-between"} mt={4}>
                      <Box>
                        <IconButton
                          isRound
                          colorScheme="red"
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                        />
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => {
                            const message = `Hello ${user?.name}!! You have ${
                              user?.points
                            } Runbhumi Points associated with mobile number -  ${
                              user?.number
                            } valid till - ${getDateFormat(user?.validTill)}`;
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
                            setInput(user);
                            onOpen();
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
          </>
        )}

        <Button mb={32} onClick={onOpen} colorScheme="blue" mt={8}>
          Add New Entry
        </Button>
      </Flex>
    </>
  );
};

export default Points;
