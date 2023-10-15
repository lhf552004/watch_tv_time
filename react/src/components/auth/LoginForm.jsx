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

const LoginForm = ({ onSubmit, error }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    // reset
  } = useForm();

  return <Center>Login</Center>;
};

export default LoginForm;
