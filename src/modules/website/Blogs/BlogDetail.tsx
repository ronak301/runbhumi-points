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
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import PageHeader from "../PageHeader";
import { db } from "../../../firebase";
import MarkdownRenderer from "../../../MarkdownRenderer";
import HtmlRenderer from "./HtmlRenderer";

interface Blog {
  title: string;
  metaTitle: string;
  metaDescription: string;
  schemaMarkup?: object;
  image: string;
  datePublished: string;
  author: string;
  tags: string[];
  content: string;
}

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError("Invalid blog slug.");
        setLoading(false);
        return;
      }

      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setBlog(querySnapshot.docs[0].data() as Blog);
        } else {
          setError("Blog not found.");
        }
      } catch (err) {
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Spinner size="xl" />
        <Text mt={2}>Loading blog...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Heading size="lg">{error}</Heading>
      </Container>
    );
  }
  console.log("blog", blog);

  return (
    <>
      <PageHeader
        title={blog?.title || ""}
        imageUrl="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      <Container maxW="container.md" py={20}>
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{blog?.metaTitle}</title>
          <meta name="description" content={blog?.metaDescription} />
          {blog?.schemaMarkup && (
            <script type="application/ld+json">
              {JSON.stringify(blog.schemaMarkup)}
            </script>
          )}
        </Helmet>

        {/* Blog Header */}
        <VStack spacing={4} align="stretch">
          <Heading size="xl" textAlign="center" mb={8}>
            {blog?.title}
          </Heading>
          <Image src={blog?.image} alt={blog?.title} borderRadius="lg" />

          <HStack justify="center" color="gray.500">
            <Text fontSize="sm">{blog?.datePublished}</Text>
            <Divider orientation="vertical" height="16px" />
            <Text fontSize="sm">{blog?.author}</Text>
          </HStack>

          {/* Tags */}
          <HStack justify="center" spacing={2}>
            {blog?.tags.map((tag, index) => (
              <Tag
                key={index}
                size="sm"
                px={3}
                py={1}
                borderRadius="full"
                bg="gray.200"
                color="gray.700"
                fontWeight="medium">
                {tag}
              </Tag>
            ))}
          </HStack>

          {/* <HtmlRenderer content={blog?.content || ""} /> */}
          <MarkdownRenderer content={blog?.content || ""} />
          {/* <Box
            mt={4}
            dangerouslySetInnerHTML={{
              __html: blog?.content?.replace(/style="[^"]*"/g, "") || "", // Remove inline styles
            }}
          /> */}
        </VStack>
      </Container>
    </>
  );
};

export default BlogDetail;
