import { Box, Flex, Text, Link, VStack, Spacer } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout({ children }) {
  return (
    <Flex height="100vh" w="100%" bg="gray.100">
      {/* Sidebar */}
      <Navbar />
      <Flex direction="column" width="100%">
        <Box as="main" flex="2">
          <Outlet /> {/* This will render child routes */}
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
