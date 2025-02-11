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

// 🎨 Vibrant Gradient Backgrounds for Each Card
const gradientBackgrounds = [
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
];

const AllBlogs = () => (
  <Container maxW="container.xl" py={10} pt={{ base: 24, md: 12 }}>
    {/* 🎭 Gradient Background Shape for Blog Section */}
    <Box
      position="absolute"
      top="-100px"
      left="0"
      w="100%"
      h="400px"
      bgGradient="linear(to-r, #84fab0, #8fd3f4)"
      opacity="0.3"
      zIndex="-1"
      filter="blur(100px)"
    />

    <Heading
      as="h1"
      size="2xl"
      mb={10}
      textAlign="center"
      fontWeight="bold"
      color="gray.900"
      bgClip="text"
      bgGradient="linear(to-r, teal.600, green.400)">
      Explore Our Blogs
    </Heading>

    <Flex wrap="wrap" gap={8} justify="center">
      {blogs.map((blog, index) => {
        const shortDescription =
          blog.metaDescription.split(". ").slice(0, 2).join(". ") + ".";

        return (
          <Box
            key={blog.id}
            position="relative"
            p={6}
            borderRadius="lg"
            bg="white"
            boxShadow="xl"
            maxW={{ base: "100%", md: "400px" }}
            transition="all 0.4s ease-in-out"
            _hover={{
              transform: "translateY(-8px) scale(1.03)",
              boxShadow: "2xl",
            }}
            overflow="hidden">
            {/* 🖼️ Blog Image (Now Crisp & Sharp) */}
            <Box position="relative" borderRadius="lg" overflow="hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                objectFit="cover"
                minH="220px"
                w="100%"
                loading="lazy"
                transition="all 0.3s ease-in-out"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>

            {/* 🎨 Gradient Overlay (Now Visible & Stylish) */}
            <Box
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bg={gradientBackgrounds[index % gradientBackgrounds.length]}
              opacity="0.2"
              zIndex="-1"
            />

            {/* 📖 Blog Content */}
            <Box mt={4} textAlign="center">
              <Heading size="md" fontWeight="bold" color="gray.900">
                {blog.title}
              </Heading>
              <Text mt={3} noOfLines={3} color="gray.600">
                {shortDescription}
              </Text>
            </Box>

            {/* 🏷️ Tags with Glassmorphism Effect */}
            <Flex wrap="wrap" mt={4} justify="center" gap={2}>
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={index}
                  size="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg={`pastel.${index % 5}`}
                  color="gray.700"
                  fontWeight="medium">
                  {tag}
                </Tag>
              ))}
            </Flex>

            {/* 🔗 Read More Button */}
            <Link to={`/blogs/${blog.slug}`}>
              <Button
                mt={5}
                colorScheme="teal"
                w="full"
                borderRadius="full"
                boxShadow="md"
                transition="all 0.3s"
                _hover={{ transform: "scale(1.05)" }}>
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
