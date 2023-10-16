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
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { useFirestore, useUser } from "reactfire";

const ComputerForm = ({ setIsOpen, values }) => {
  const toast = useToast();
  const firestore = useFirestore();
  const { data: user } = useUser();

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
        setIsOpen(false);
        await updateDoc(docRef, values);
        toast({
          title: "Update computer successfully.",
          status: "success",
        });
      } catch (error) {
        toast({
          title: `Update computer failed with error: ${error}`,
          status: "error",
        });
      }
      return;
    }

    try {
      await addDoc(collection(firestore, "computers"), {
        ...values,
        schedule: {},
        ownerId: user.uid, // Assuming each computer document should have the UID of its owner
      });
      toast({
        title: "Create computer successfully.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: `Create computer failed with error: ${error}`,
        status: "error",
      });
    }
    setIsOpen(false);
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
