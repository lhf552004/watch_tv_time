import { Flex, Box } from "@chakra-ui/react";
import GlobalLoadingIndicator from "../components/commons/GlobalLoadingIndicator";
import AuthCheckContainer from "../containers/AuthCheckContainer";
export default function Main({ menu, children }) {
  // TODO: Manage menu state width with zustand useStore and sync store with localStorage

  const menuOpenWidth = "300px";
  const menuClosedWidth = "60px";
  const mainWidthClosed = `calc(100% - ${menuClosedWidth})`;
  const mainWidthOpen = `calc(100% - ${menuOpenWidth})`;

  return (
    <>
      <AuthCheckContainer>
        <Flex direction="row" color="white" height="100vh">
          {/* Menu Column */}
          <Box
            width={{ base: menuClosedWidth, lg: menuOpenWidth }}
            display={{ base: "none", md: "block" }}
            overflow="scroll"
          >
            {menu}
          </Box>

          {/* Content Section */}
          <Box
            width={{ base: "100%", md: mainWidthClosed, lg: mainWidthOpen }}
            maxHeight={"100vh"}
            overflow={"scroll"}
            padding={5}
            bg="brand.background"
            id="contentContainer"
          >
            <GlobalLoadingIndicator />
            {children}
          </Box>
        </Flex>
      </AuthCheckContainer>
    </>
  );
}
