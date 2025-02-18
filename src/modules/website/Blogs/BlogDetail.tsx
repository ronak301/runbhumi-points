import {
  Box,
  Container,
  Heading,
  Image,
  Tag,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { blogs } from "./constants";
import { Helmet } from "react-helmet";

const BlogDetail = () => {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Heading size="lg">Blog Not Found</Heading>
        <Text mt={2}>Oops! The blog you're looking for doesn't exist.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={20}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{blog.metaTitle}</title>
        <meta name="description" content={blog.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify(blog.schemaMarkup)}
        </script>
      </Helmet>

      {/* Blog Header */}
      <VStack spacing={4} align="stretch">
        <Image src={blog.image} alt={blog.title} borderRadius="lg" />
        <Heading size="xl" textAlign="center">
          {blog.title}
        </Heading>
        <HStack justify="center" color="gray.500">
          <Text fontSize="sm">{blog.datePublished}</Text>
          <Divider orientation="vertical" height="16px" />
          <Text fontSize="sm">{blog.author}</Text>
        </HStack>

        {/* Tags */}
        <HStack justify="center" spacing={2}>
          {blog.tags.map((tag, index) => (
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
        </HStack>

        {/* Blog Content */}
        <Box mt={4} dangerouslySetInnerHTML={{ __html: blog.content }} />
      </VStack>
    </Container>
  );
};

export default BlogDetail;
