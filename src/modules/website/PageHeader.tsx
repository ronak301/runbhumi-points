import { Box, Heading } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  imageUrl: string;
}

const PageHeader = ({ title, imageUrl }: PageHeaderProps) => {
  return (
    <Box
      position="relative"
      width="100%"
      height="300px"
      bgImage={`url(${imageUrl})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      color="white"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "blackAlpha.600",
      }}>
      {/* Page Title */}
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="bold"
        position="relative"
        zIndex={1}>
        {title}
      </Heading>
    </Box>
  );
};

export default PageHeader;
