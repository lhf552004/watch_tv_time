import { Button } from "@chakra-ui/react";

const SignupButton = () => {
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
      Sign Up
    </Button>
  );
};

export default SignupButton;
