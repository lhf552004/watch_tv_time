import { Box, Heading, Link, Text, Flex, Divider } from "@chakra-ui/react";

export default function About() {
  return (
    <Flex
      flexDirection={"column"}
      // This is a hack to make the footer stick to the bottom of the page
      justifyContent={"space-between"}
      height={"calc(100vh - 80px)"} // Calc the height of the page minus the height of the header
    >
      <Box>
        <Heading as="h1" textTransform={"uppercase"}>
          AuroraSoft
        </Heading>
      </Box>
    </Flex>
  );
}
