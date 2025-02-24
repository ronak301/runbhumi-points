import {
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Box,
  Button,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { projects } from "./constants";
import PageHeader from "../PageHeader";

const Projects = () => (
  <>
    <PageHeader
      title="Recent Projects"
      imageUrl="https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    />
    <Container
      maxW={{ base: "100%", md: "container.xl" }}
      py={10}
      pt={{ base: 12, md: 12 }}>
      {/* <Heading as="h1" size="2xl" mb={6} textAlign="center">
        Our Projects
      </Heading> */}
      <Flex wrap="wrap" gap={6} justify="center">
        {projects.map((project) => (
          <Box
            key={project.id}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            bg="white"
            maxW={{ base: "100%", md: "350px" }}
            transition="all 0.3s ease-in-out"
            _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}>
            <Image
              src={project.image}
              alt={project.title}
              borderRadius="lg"
              boxShadow="md"
              minH={200}
            />
            <Heading size="md" mt={4} textAlign="center">
              {project.title}
            </Heading>
            <Flex align="center" mt={2} color="gray.500" justify="center">
              <FaMapMarkerAlt />
              <Text ml={2}>{project.location}</Text>
            </Flex>
            <Text mt={2} noOfLines={3} textAlign="center" color="gray.700">
              {project.shortDescription}
            </Text>
            {/* <Flex wrap="wrap" mt={4} justify="center" gap={2}>
            {project.keywords.slice(0, 3).map((keyword, index) => (
              <Tag key={index} size="md" colorScheme="blue">
                {keyword}
              </Tag>
            ))}
          </Flex> */}
            <Link to={`/projects/${project.slug}`}>
              <Button
                mt={4}
                colorScheme="blue"
                w="full"
                borderRadius="full"
                boxShadow="md">
                View Details
              </Button>
            </Link>
          </Box>
        ))}
      </Flex>
    </Container>
  </>
);

export default Projects;
