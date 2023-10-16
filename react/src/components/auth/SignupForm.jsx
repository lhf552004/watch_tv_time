import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Switch,
  Center,
  Card,
  Heading,
} from "@chakra-ui/react";

import { useFunctions, useFirestore } from "reactfire";
import { httpsCallable } from "@firebase/functions";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const toast = useToast();
  const functions = useFunctions();
  const navigate = useNavigate();
  const callAddUser = httpsCallable(functions, "addNewUser");

  const addUser = async (formData) => {
    try {
      return await callAddUser(formData);
    } catch (error) {
      toast({ title: "User could not be created", status: "error" });
    }
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {},
  });

  async function onSubmit(values) {
    const user = {
      ...values,
    };

    const response = await addUser(user);

    if (response.data.status) {
      toast({
        title: response.data.message,
        status: response.data.status,
      });
      if (response.data.status === "success") {
        navigate("/login");
      }
    }
  }

  return (
    <Center p={4}>
      <Card width="500px">
        <Center>
          <Heading size="md" p={4}>
            AuroraSoft Time Admin
          </Heading>
        </Center>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl p={3} isInvalid={errors.name}>
            <FormLabel htmlFor="displayName">Name</FormLabel>
            <Input
              id="displayName"
              placeholder="name"
              {...register("displayName", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.displayName && errors.displayName.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl p={3} isInvalid={errors.password} mt={2}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password should have at least 6 characters",
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl p={3} isInvalid={errors.organisation}>
            <FormLabel htmlFor="organization">Organisation</FormLabel>
            <Input
              id="organisation"
              placeholder="organization"
              {...register("organization")}
            />
            <FormErrorMessage>
              {errors.organization && errors.organization.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl p={3} isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="email"
              {...register("email", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl p={3} isInvalid={errors.phone}>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <Input
              id="phone"
              type="phone"
              placeholder="phone"
              {...register("phone")}
            />
            <FormErrorMessage>
              {errors.phone && errors.phone.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl p={3} isInvalid={errors.notes}>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <Input id="notes" placeholder="notes" {...register("notes")} />
            <FormErrorMessage>
              {errors.notes && errors.notes.message}
            </FormErrorMessage>
          </FormControl>

          <Flex mb={3} width="100%" justifyContent="right">
            <Button
              mt={4}
              bg="brand"
              color="white"
              isLoading={isSubmitting}
              type="submit"
            >
              Confirm
            </Button>
            <Button mt={4} ml={3} variant="ghost" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </Flex>
        </form>
      </Card>
    </Center>
  );
};

export default SignupForm;
