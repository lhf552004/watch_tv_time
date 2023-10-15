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

import Spinner from "../ui/Spinner";

import { useFunctions, useFirestore } from "reactfire";
import { httpsCallable } from "@firebase/functions";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

import MultiSelect from "../ui/MultiSelect";

const ScheduleForm = ({ setIsOpen, values, studies }) => {
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
    const studies = values.studies.length
      ? values.studies.map((study) => parseInt(study.value))
      : [];
    // studies must be Ints

    const parsedStudyId = {
      ...values,
      studies,
    };
    // if update
    if (values.id) {
      try {
        const docRef = doc(firestore, `users/${values.id}`);
        await updateDoc(docRef, parsedStudyId);
        setIsOpen(false);
      } catch (error) {
        console.log(error);
      }
      return;
    }

    // else we're creating
    const response = await addUser(parsedStudyId);

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
        <FormLabel htmlFor="ip">Ip</FormLabel>
        <Input id="ip" placeholder="ip" {...register("ip")} />
        <FormErrorMessage>{errors.ip && errors.ip.message}</FormErrorMessage>
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
      <MultiSelect
        control={control}
        isMulti
        name="studies"
        id="studies"
        options={
          studies.length
            ? studies.map((study) => ({
                label: study.name,
                value: study.study_id,
              }))
            : []
        }
        placeholder="Studies"
        label="Studies"
      />
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

export default ScheduleForm;
