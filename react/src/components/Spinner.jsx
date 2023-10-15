import { Flex, Spinner as ChakraSpinner } from "@chakra-ui/react";

export default function Spinner() {
  return (
    <Flex alignItems="center" justifyContent="center" w="100%" h="100%">
      <ChakraSpinner />
    </Flex>
  );
}
