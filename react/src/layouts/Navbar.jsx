import { Box, Flex, Text, Link, VStack, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import LogoutButton from "../components/auth/LogoutButton";
import HideIfNotAdmin from "../components/auth/HideIfNotAdmin";
import { useSigninCheck } from "reactfire";
import LoginButton from "../components/auth/LoginButton";
import Spinner from "../components/commons/Spinner";
import SignupButton from "../components/auth/SignupButton";

function Navbar({ children }) {
  const { status, data: signInCheckResult } = useSigninCheck();
  const isSignedIn = signInCheckResult && signInCheckResult.signedIn;

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
      {isSignedIn === true && (
        <Link
          as={RouterLink}
          to="/computers"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          Computers
        </Link>
      )}

      {/* ...other links */}
      <Spacer />
      <HideIfNotAdmin>
        <Link
          as={RouterLink}
          to="/admin"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          User Management
        </Link>
      </HideIfNotAdmin>
      {isSignedIn === true ? (
        <Link
          as={RouterLink}
          to="/"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          <LogoutButton />
        </Link>
      ) : (
        <Link
          as={RouterLink}
          to="/login"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          <LoginButton />
        </Link>
      )}
      {isSignedIn === false && (
        <Link
          as={RouterLink}
          to="/signup"
          color="white"
          _hover={{ textDecoration: "underline" }}
        >
          <SignupButton />
        </Link>
      )}
    </VStack>
  );
}

export default Navbar;
