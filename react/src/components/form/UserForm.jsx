import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Switch,
} from "@chakra-ui/react";

import { useFunctions, useFirestore } from "reactfire";
import { httpsCallable } from "@firebase/functions";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const UserForm = ({ setIsOpen, values }) => {
  const toast = useToast();
  const functions = useFunctions();
  const firestore = useFirestore();
  const callAddUser = httpsCallable(functions, "addNewUser");

  const addUser = async (formData) => {
    try {
      setIsOpen(false);
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
    defaultValues: {
      ...values,
    },
  });

  async function onSubmit(values) {
    const user = {
      ...values,
    };
    // if update
    if (values.id) {
      try {
        const docRef = doc(firestore, `users/${values.id}`);
        await updateDoc(docRef, user);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
      }
      return;
    }

    // else we're creating
    const response = await addUser(user);

    if (response.data.status) {
      toast({
        title: response.data.message,
        status: response.data.status,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
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

      <FormControl isInvalid={errors.password} mt={2}>
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

      <FormControl
        isInvalid={errors.access_restricted}
        display="flex"
        alignItems="center"
        mt={2}
      >
        <FormLabel htmlFor="isAdmin">Administrator</FormLabel>
        <Switch id="" name="isAdmin" {...register("isAdmin")} />
        <FormErrorMessage>
          {errors.isAdmin && errors.isAdmin.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.organisation}>
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

      <FormControl isInvalid={errors.email}>
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

      <FormControl isInvalid={errors.phone}>
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

      <FormControl isInvalid={errors.notes}>
        <FormLabel htmlFor="notes">Notes</FormLabel>
        <Input id="notes" placeholder="notes" {...register("notes")} />
        <FormErrorMessage>
          {errors.notes && errors.notes.message}
        </FormErrorMessage>
      </FormControl>

      <Flex width="100%" justifyContent="right">
        <Button
          mt={4}
          bg="brand"
          color="white"
          isLoading={isSubmitting}
          type="submit"
        >
          Save
        </Button>
        {setIsOpen && (
          <Button
            mt={4}
            ml={3}
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        )}
      </Flex>
    </form>
  );
};

export default UserForm;
