import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  query as q,
  orderBy,
} from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";
import { filter, includes, isEmpty, lowerCase, map, reduce } from "lodash";
import { ChevronDownIcon, EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getDateFormat } from "../../utils/date";
import * as moment from "moment";
import { DeleteEntry } from "../../components/DeleteEntry";
import AddPointsModal from "./AddPointsModal";
import useStore from "../../zustand/useStore";

export const VALID_TILL_DURATION = 30;

export const getPoints = (points) => {
  if (isEmpty(points)) return "";
  const length = points?.length;
  return points[length - 1] || 0;
};

export const isValidPoints = (user) => {
  const validTill = moment(user?.validTill);
  const currentDate = moment(new Date());
  return validTill.diff(currentDate, "days") > 0;
};

const Points = () => {
  const initialDocs = q(collection(db, "points"), orderBy("updatedAt", "desc"));

  const [users, setUsers] = React.useState([]);
  const [updatedUsers, setUpdatedUsers] = React.useState();
  const [query, setQuery] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = React.useState({});
  const [points, setPoints] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [docs, setDocs] = React.useState(initialDocs);
  const { setUsersWithPoints } = useStore();

  React.useEffect(() => {
    console.log("users", users);
    if (isEmpty(users) && !loading) {
      fetchUsers();
    } else {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setUsersWithPoints(users);
  }, [setUsersWithPoints, users]);

  const getValidTill = () => {
    return moment(new Date())
      .add(VALID_TILL_DURATION, "days")
      .format("YYYY-MM-DD");
  };

  const fetchUsers = async () => {
    await getDocs(docs).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const updatedData = sortUsersByUpdateDate(newData);
      setUsers(updatedData);
      setUpdatedUsers(updatedData);
      setQuery("");
    });
  };

  const onUpdateEntry = async () => {
    try {
      const userStored = filter(updatedUsers, (u) => u?.id === input?.id)?.[0];
      const userRef = doc(db, "points", input?.id);
      await setDoc(
        userRef,
        {
          name: input?.name,
          number: input?.number,
          points: [...userStored?.points, points],
          validTill: getValidTill(),
          updatedAt: Date.now(),
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
        `User with this number already exist, please edit that user instead with name - ${input?.name}`
      );
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "points"), {
        name: input?.name,
        number: input?.number,
        points: [points],
        updatedAt: Date.now(),
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
      const sortedData = sortUsersByUpdateDate(users);
      setUpdatedUsers(sortedData);
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

  const totalPoints = reduce(
    users,
    (acc, u) => (acc += Number(getPoints(u?.points))),
    0
  );

  const sortUsersByUpdateDate = (data) => {
    return data?.sort((a, b) => {
      return a?.updatedAt < b?.updatedAt ? 1 : -1;
    });
  };

  const sortUsersByDaysRemaining = (data, order = "asc") => {
    const isAscending = order === "asc";
    const firstVal = isAscending ? -1 : 1;
    const secondVal = isAscending ? 1 : -1;
    setUpdatedUsers(
      [...data]?.sort((a, b) => {
        return a?.validTill < b?.validTill ? firstVal : secondVal;
      })
    );
  };

  const sortByPoints = (data, order = "asc") => {
    const isAscending = order === "asc";
    const firstVal = isAscending ? -1 : 1;
    const secondVal = isAscending ? 1 : -1;
    setUpdatedUsers(
      [...data]?.sort((a, b) => {
        return Number(getPoints(a?.points)) < Number(getPoints(b?.points))
          ? firstVal
          : secondVal;
      })
    );
  };

  const isUpdating = !!input?.id;

  return (
    <>
      <Flex
        backgroundColor={"rgb(247,245,238)"}
        scrollBehavior="auto"
        paddingLeft={"4%"}
        paddingRight={"4%"}
        flexDirection={"column"}>
        <AddPointsModal
          isOpen={isOpen}
          onClose={onClose}
          input={input}
          setInput={setInput}
          loading={loading}
          onAddEntry={onAddEntry}
          setPoints={setPoints}
          getPoints={getPoints}
          isUpdating={isUpdating}
        />

        <Flex mt={4} flexDirection={"column"}>
          <Flex
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={1}
            mb={2}>
            <Box backgroundColor={"white"} px={2} py={2} borderRadius={8}>
              <Box fontSize={10}>{`Total Users - ${users?.length}`}</Box>
              <Box fontSize={10}>{`Total Points -  ${totalPoints}`}</Box>
              <Box fontSize={10}>
                {`Valid Till Duration (in days) - ${VALID_TILL_DURATION}`}
              </Box>
            </Box>
            <Box>
              <Button
                onClick={() => {
                  setInput({});
                  onOpen();
                }}
                colorScheme="blue">
                Add
              </Button>
            </Box>
          </Flex>
          <Box fontSize={14} mb={2}>
            Search
          </Box>
          <Flex>
            <Input
              h={"48px"}
              autoFocus
              borderColor={"black"}
              height={12}
              mb={4}
              width={"100%"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              backgroundColor={"white"}
              placeholder="Search Phone Number / Name"
            />
            <Menu maxW={300}>
              <MenuButton
                h={"48px"}
                ml={2}
                w={120}
                border={"1px solid black"}
                as={Button}
                rightIcon={<ChevronDownIcon />}>
                Sort
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    sortUsersByDaysRemaining(updatedUsers, "desc")
                  }>
                  Sort By Days Remaining (High to Low)
                </MenuItem>
                <MenuItem
                  onClick={() => sortUsersByDaysRemaining(updatedUsers, "asc")}>
                  Sort By Days Remaining (Low to High)
                </MenuItem>
                <MenuItem onClick={() => sortByPoints(updatedUsers, "desc")}>
                  Sort By Points (High to low)
                </MenuItem>
                <MenuItem onClick={() => sortByPoints(updatedUsers, "asc")}>
                  Sort By Points (Low to High)
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isEmpty(updatedUsers) ? (
          <Box textAlign={"center"} mt={12} mb={8}>
            No Data
          </Box>
        ) : (
          <>
            <Box>
              {map(updatedUsers, (user) => {
                // append user's mobile number with 91 if its not already there.
                const updatedNumber = user?.number?.startsWith("91")
                  ? user?.number
                  : `91${user?.number}`;

                const remainingDays = moment(new Date(user?.validTill))?.diff(
                  moment(),
                  "days"
                );
                return (
                  <Box
                    key={user?.id}
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
                        {`${getPoints(user?.points)}`}
                      </Text>
                    </Flex>
                    <Text>{user?.number}</Text>
                    <Flex justifyContent={"space-between"}>
                      <Text color="gray.700">{`Valid till - ${getDateFormat(
                        user?.validTill
                      )}`}</Text>
                      <Text color="gray.700">{`${remainingDays} days remaining`}</Text>
                    </Flex>
                    <Flex>
                      <Text
                        fontSize={10}
                        color="gray.700">{`History of points - [${user?.points?.join(
                        ","
                      )}]`}</Text>
                    </Flex>

                    <Flex justifyContent={"space-between"} mt={4}>
                      <DeleteEntry user={user} fetchUsers={fetchUsers} />
                      <Box>
                        <IconButton
                          onClick={() => {
                            const message = `Hello ${
                              user?.name
                            }!! You have *${getPoints(
                              user?.points
                            )} Runbhumi Points* associated with mobile number -  ${
                              user?.number
                            } .\n*Valid till - ${moment(user?.validTill).format(
                              "DD/MM/YYYY"
                            )}*`;
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
      </Flex>
    </>
  );
};

export default Points;
