import { useForm } from "react-hook-form";

import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Center,
  Heading,
} from "@chakra-ui/react";
import Card from "../commons/Card";
import AlertBox from "../commons/Alert";

import ForgetPassword from "./ForgotPassword";

const LoginForm = ({ onSubmit, error }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    // reset
  } = useForm();

  return (
    <Center>
      <Card width="500px">
        <Center>
          <Heading size="md" mb={4}>
            AuroraSoft Time Admin
          </Heading>
        </Center>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              placeholder="email"
              {...register("email", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="password"
              {...register("password", {
                required: "This is required",
              })}
            />
            <ForgetPassword />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Flex width="100%" justifyContent="right" pb={2}>
            <Button
              mt={4}
              bg="brand"
              color="white"
              isLoading={isSubmitting}
              type="submit"
            >
              Sign In
            </Button>
          </Flex>
          {error && <AlertBox title={error} status="error" />}
        </form>
      </Card>
    </Center>
  );
};

export default LoginForm;
