import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  Box,
  Button,
  VStack,
  Heading,
  Image,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";

interface Blog {
  id: string;
  title: string;
  image: string;
  metaDescription: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const snapshot = await getDocs(collection(db, "blogs"));
      const blogData: Blog[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Blog),
        id: doc.id,
      }));
      setBlogs(blogData);
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "blogs", id));
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  console.log("blogs", blogs);

  return (
    <Box p={8}>
      <Heading mb={6} textAlign="center">
        All Blogs
      </Heading>
      <Button
        colorScheme="green"
        onClick={() => navigate("/admin/blogs/create")}
        mb={6}>
        Create Blog
      </Button>

      {blogs.length === 0 ? (
        <Text textAlign="center" fontSize="xl" color="gray.500">
          No blogs available
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {blogs.map((blog) => (
            <Box
              key={blog.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              p={4}
              _hover={{ boxShadow: "lg" }}>
              <Image
                src={blog.image}
                alt={blog.title}
                objectFit="cover"
                borderRadius="md"
                height="150px"
                width="100%"
              />
              <VStack align="start" mt={4} spacing={2}>
                <Heading size="md">{blog.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {blog.metaDescription}
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default BlogList;
