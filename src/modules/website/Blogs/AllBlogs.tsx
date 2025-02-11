import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { blogs } from "./constants";

const AllBlogs = () => (
  <Container
    maxW={{ base: "100%", md: "container.xl" }}
    py={10}
    pt={{ base: 24, md: 12 }}>
    <Heading
      as="h1"
      size="2xl"
      mb={6}
      textAlign={{ base: "center", md: "left" }}>
      Our Blogs
    </Heading>
    <Flex wrap="wrap" gap={6} justify={{ base: "center", md: "left" }}>
      {blogs.map((blog) => {
        const shortDescription =
          blog.metaDescription.split(". ").slice(0, 2).join(". ") + "."; // Extracting first 2 sentences

        return (
          <Box
            key={blog.id}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            bg="white"
            maxW={{ base: "100%", md: "350px" }}
            transition="all 0.3s ease-in-out"
            _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}>
            <Image
              src={blog.image}
              alt={blog.title}
              borderRadius="lg"
              boxShadow="md"
              minH={200}
            />
            <Heading size="md" mt={4} textAlign="center">
              {blog.title}
            </Heading>
            <Text mt={2} noOfLines={3} textAlign="center" color="gray.700">
              {shortDescription}
            </Text>
            <Flex wrap="wrap" mt={4} justify="center" gap={2}>
              {blog.tags.slice(0, 3).map((keyword, index) => (
                <Tag
                  key={index}
                  size="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg={`pastel.${index % 5}`} // Using a pastel color variant dynamically
                  color="gray.700"
                  fontWeight="medium">
                  {keyword.length > 12
                    ? `${keyword.substring(0, 10)}…`
                    : keyword}{" "}
                  {/* Truncate long keywords */}
                </Tag>
              ))}
            </Flex>
            <Link to={`/blogs/${blog.slug}`}>
              <Button
                mt={4}
                colorScheme="green"
                w="full"
                borderRadius="full"
                boxShadow="md">
                Read More
              </Button>
            </Link>
          </Box>
        );
      })}
    </Flex>
  </Container>
);

export default AllBlogs;
