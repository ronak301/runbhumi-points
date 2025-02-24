import {
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Box,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { projects } from "./constants";
import PageHeader from "../PageHeader";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Text>Project not found</Text>;

  return (
    <>
      <PageHeader
        title={project.title}
        imageUrl="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      <Container
        maxW={{ base: "100%", md: "container.xl" }}
        py={10}
        pt={{ base: 0, md: 12 }}>
        <Box boxShadow="lg" borderRadius="lg" p={6} bg="white">
          {/* <Heading as="h1" size="2xl" mb={4} textAlign="center">
            {project.title}
          </Heading> */}
          <Image
            src={project.image}
            alt={project.title}
            mt={8}
            borderRadius="lg"
            boxShadow="md"
          />
          <Flex align="center" mt={4} color="gray.500" justify="center">
            <FaMapMarkerAlt />
            <Text ml={2} fontSize="lg">
              {project.location}
            </Text>
          </Flex>
          <Text mt={6} fontSize="xl" textAlign="justify" lineHeight="1.6">
            {project.description}
          </Text>

          {/* Display Keywords as Tags */}
          <Flex wrap="wrap" mt={6} gap={2} justify="center">
            {project.keywords.map((keyword, index) => (
              <Tag key={index} size="lg" colorScheme="blue">
                {keyword}
              </Tag>
            ))}
          </Flex>

          {/* Display Reviews */}
          <Box mt={8}>
            <Heading as="h2" size="lg" mb={4} textAlign="center">
              Reviews ({project.reviews.length}) - Avg Rating: {project.rating}
            </Heading>
            <VStack spacing={4} align="stretch">
              {project.reviews.map((review, index) => (
                <Box
                  key={index}
                  p={4}
                  boxShadow="sm"
                  borderRadius="md"
                  bg="gray.100">
                  <Text fontWeight="bold">{review.user}</Text>
                  <Text color="yellow.500">Rating: {review.rating} ⭐</Text>
                  <Text>{review.comment}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProjectDetail;
