import { Box, Flex, Text, Link, VStack, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Navbar({ children }) {
  return (
    <VStack
      as="nav"
      bg="green.600"
      padding={5}
      width="250px"
      spacing={4}
      alignItems="start"
    >
      <Box>
        <Link
          as={RouterLink}
          color="white"
          fontSize="xl"
          fontWeight="bold"
          _hover={{ textDecoration: "underline" }}
        >
          AuroraSoft
        </Link>
      </Box>

      <Link
        as={RouterLink}
        to="/computers"
        color="white"
        _hover={{ textDecoration: "underline" }}
      >
        Computers
      </Link>

      {/* ...other links */}
      <Spacer />

      <Link
        as={RouterLink}
        to="/admin"
        color="white"
        _hover={{ textDecoration: "underline" }}
      >
        User Management
      </Link>
      <Link color="white" _hover={{ textDecoration: "underline" }}>
        Logout
      </Link>
    </VStack>
  );
}

export default Navbar;
