import { Box } from "@chakra-ui/react";

interface HtmlRendererProps {
  content: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content }) => {
  return (
    <Box
      mt={4}
      maxW="800px"
      mx="auto"
      fontSize="18px"
      lineHeight="1.8"
      letterSpacing="0.02em"
      color="gray.800"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HtmlRenderer;
