import { Box, Flex, Text, Link, VStack, Spacer } from "@chakra-ui/react";

function Layout({ children }) {
  return (
    <Flex height="100vh" w="100%" bg="gray.100">
      {/* Sidebar */}
      <VStack
        as="nav"
        bg="green.600"
        padding={5}
        width="250px"
        spacing={4}
        alignItems="start"
      >
        <Box>
          <Text color="white" fontSize="xl" fontWeight="bold">
            AuroraSoft
          </Text>
        </Box>
        <Link color="white" _hover={{ textDecoration: "underline" }}>
          Computers
        </Link>
        {/* ...other links */}
        <Spacer />

        <Link color="white" _hover={{ textDecoration: "underline" }}>
          User Management
        </Link>
        <Link color="white" _hover={{ textDecoration: "underline" }}>
          Logout
        </Link>
      </VStack>
      <Flex direction="column" width="100%">
        {/* Header, Sidebar, etc. can be other Chakra components or custom components */}

        <Box as="main" flex="2">
          {children}
        </Box>

        {/* Footer can be another Box or custom component */}
        <Box as="footer" bg="gray.800" color="white" p={4}>
          © AuroraSoft
        </Box>
      </Flex>
    </Flex>
  );
}

export default Layout;
