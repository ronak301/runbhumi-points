import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Box,
  Link,
  Heading,
  Text,
  List,
  ListItem,
  Code,
} from "@chakra-ui/react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Box
      mt={4}
      maxW="800px"
      mx="auto"
      fontSize="18px"
      lineHeight="1.8"
      letterSpacing="0.02em"
      color="gray.800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <Heading as="h1" size="2xl" mt={6} mb={4} fontWeight="bold">
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading as="h2" size="xl" mt={6} mb={4} fontWeight="semibold">
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" size="lg" mt={5} mb={3} fontWeight="medium">
              {children}
            </Heading>
          ),
          p: ({ children }) => (
            <Text mb={4} lineHeight="1.8" letterSpacing="0.02em">
              {children}
            </Text>
          ),
          a: ({ href, children }) => (
            <Link
              color="blue.600"
              href={href}
              isExternal
              fontWeight="bold" // ✅ Makes the link bold
              _hover={{ textDecoration: "underline", color: "blue.800" }}>
              {children}
            </Link>
          ),
          ul: ({ children }) => (
            <List spacing={3} styleType="disc" ml={5} mb={4}>
              {children}
            </List>
          ),
          ol: ({ children }) => (
            <List as="ol" spacing={3} styleType="decimal" ml={5} mb={4}>
              {children}
            </List>
          ),
          li: ({ children }) => <ListItem>{children}</ListItem>,
          code: ({ children }) => (
            <Code
              colorScheme="yellow"
              fontSize="0.95em"
              px={2}
              py={1}
              borderRadius="4px">
              {children}
            </Code>
          ),
          blockquote: ({ children }) => (
            <Box
              borderLeft="4px solid"
              borderColor="gray.300"
              pl={4}
              fontStyle="italic"
              color="gray.600"
              my={4}>
              {children}
            </Box>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
