import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useFunctions, useFirestore } from "reactfire";
import { httpsCallable } from "@firebase/functions";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const ComputerForm = ({ setIsOpen, values }) => {
  const toast = useToast();
  const functions = useFunctions();
  const firestore = useFirestore();
  const addComputer = httpsCallable(functions, "addComputer");

  const addComputerFn = async (formData) => {
    try {
      setIsOpen(false);
      return await addComputer(formData);
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
    // if update
    console.log(values);
    if (values.id) {
      try {
        const docRef = doc(firestore, `computers/${values.id}`);
        await updateDoc(docRef, values);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    const emptySchedule = { ...values, schedule: {} };
    console.log(emptySchedule);
    // else we're creating
    const response = await addComputerFn(emptySchedule);

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
        <FormLabel htmlFor="computerName">Name</FormLabel>
        <Input
          id="computerName"
          placeholder="computer name"
          {...register("computerName", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          {errors.computerName && errors.computerName.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.organisation}>
        <FormLabel htmlFor="ipAddress">Ip Address</FormLabel>
        <Input
          id="ipAddress"
          placeholder="ipAddress"
          {...register("ipAddress")}
        />
        <FormErrorMessage>
          {errors.ipAddress && errors.ipAddress.message}
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

export default ComputerForm;
