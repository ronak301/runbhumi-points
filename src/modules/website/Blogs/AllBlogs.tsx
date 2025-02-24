import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import PageHeader from "../PageHeader";
import { db } from "../../../firebase";

// 🎨 Vibrant Gradient Backgrounds for Each Card
const gradientBackgrounds = [
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)",
];

// Define the Blog type
interface Blog {
  id: string;
  title: string;
  slug: string;
  image: string;
  metaDescription: string;
  tags: string[];
}

const AllBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "blogs"));
        const blogList = snapshot.docs.map((doc) => ({
          ...(doc.data() as Blog),
          id: doc.id,
        }));
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <PageHeader
        title="Blogs"
        imageUrl="https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
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

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : blogs.length === 0 ? (
          <Text fontSize="lg" textAlign="center" color="gray.600">
            No blogs found.
          </Text>
        ) : (
          <Flex wrap="wrap" gap={6} justify="center">
            {blogs.map((blog, index) => {
              const shortDescription =
                blog.metaDescription.split(". ").slice(0, 1).join(". ") + "."; // Keep only 1 sentence

              return (
                <Box
                  key={blog.id}
                  position="relative"
                  p={4}
                  borderRadius="lg"
                  bg="white"
                  boxShadow="md"
                  maxW={{ base: "100%", md: "320px" }} // Smaller width
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "translateY(-5px) scale(1.02)",
                    boxShadow: "lg",
                  }}
                  overflow="hidden">
                  {/* 🖼️ Blog Image */}
                  <Box position="relative" borderRadius="lg" overflow="hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      objectFit="cover"
                      h="120px" // Reduced height
                      w="100%"
                      loading="lazy"
                      transition="all 0.3s ease-in-out"
                      _hover={{ transform: "scale(1.05)" }}
                    />
                  </Box>

                  {/* 🎨 Gradient Overlay */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    bg={gradientBackgrounds[index % gradientBackgrounds.length]}
                    opacity="0.15"
                    zIndex="-1"
                  />

                  {/* 📖 Blog Content */}
                  <Box mt={3} textAlign="center">
                    <Heading
                      size="sm"
                      fontWeight="bold"
                      color="gray.900"
                      noOfLines={2}>
                      {blog.title}
                    </Heading>
                    <Text mt={2} fontSize="sm" noOfLines={2} color="gray.600">
                      {shortDescription}
                    </Text>
                  </Box>

                  {/* 🏷️ Tags */}
                  <Flex wrap="wrap" mt={3} justify="center" gap={1}>
                    {blog.tags.slice(0, 2).map((tag, index) => (
                      <Tag
                        key={index}
                        size="sm"
                        px={2}
                        py={1}
                        borderRadius="full"
                        bg="gray.100"
                        color="gray.700"
                        fontSize="xs">
                        {tag}
                      </Tag>
                    ))}
                  </Flex>

                  {/* 🔗 Read More Button */}
                  <Link to={`/news-blogs/${blog.slug}`}>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      w="full"
                      size="sm"
                      borderRadius="full"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{ transform: "scale(1.05)" }}>
                      Read More
                    </Button>
                  </Link>
                </Box>
              );
            })}
          </Flex>
        )}
      </Container>
    </>
  );
};

export default AllBlogs;
