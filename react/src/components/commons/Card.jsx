import React from "react";
import { Box } from "@chakra-ui/react";

const Card = ({ children, width = "auto" }) => {
  return (
    <Box
      // layerStyle="translucent.thin"
      shadow="md"
      p={6}
      m={2}
      layerStyle="card.light"
      w={width}
    >
      {children}
    </Box>
  );
};

export default Card;
