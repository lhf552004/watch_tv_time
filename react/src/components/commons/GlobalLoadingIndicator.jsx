import { Box, Spinner } from "@chakra-ui/react";
import { useNavigation } from "react-router-dom";

const GlobalLoadingIndicator = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (!isLoading) return null;
  return (
    <Box p={5} position={"fixed"} marginLeft={"calc(50vw - 300px)"}>
      <Spinner size={"lg"} color="green" />
    </Box>
  );
};

export default GlobalLoadingIndicator;
