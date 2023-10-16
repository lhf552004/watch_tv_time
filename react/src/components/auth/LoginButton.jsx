import React from "react";
import { Button } from "@chakra-ui/react";

const LoginButton = () => {
  return (
    <Button
      size="sm"
      rounded="md"
      // color={["primary", "primary", "brand.light", "brand.light"]}
      color="white"
      bg={["brand_light", "brand_light", "brand.strong", "brand.strong"]}
      _hover={{
        bg: ["brand.100", "brand.100", "brand.600", "brand.600"],
      }}
    >
      Sign In
    </Button>
  );
};

export default LoginButton;
