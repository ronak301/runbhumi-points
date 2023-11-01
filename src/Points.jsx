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
} from "@chakra-ui/react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";
import { filter, includes, map } from "lodash";

const Points = () => {
  const [users, setUsers] = React.useState();
  const [updatedUsers, setUpdatedUsers] = React.useState();
  const [query, setQuery] = React.useState("");

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
      console.log(newData);
    });
  };

  const onAddEntry = async (values) => {
    try {
      const docRef = await addDoc(collection(db, "points"), {
        name: "Abhay",
        points: 600,
        number: "9649354356",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
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
      paddingTop={"10%"}
      paddingLeft={"10%"}
      paddingRight={"10%"}
      flexDirection={"column"}>
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
      <Button onClick={onAddEntry} colorScheme="blue" mt={8}>
        Add New Entry
      </Button>
    </Flex>
  );
};

export default Points;
