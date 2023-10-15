import { useFirestoreCollectionData, useFunctions } from "reactfire";
import { httpsCallable } from "@firebase/functions";
import React, { useState } from "react";
import { useFirestore } from "reactfire";
import { collection } from "firebase/firestore";
import {
  Flex,
  Button,
  useToast,
  Grid,
  GridItem,
  Text,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";

import Spinner from "./Spinner";
import ModalContainer from "../containers/ModalContainer";
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";
import ConfirmModal from "./ConfirmModal";
import ComputerForm from "./form/ComputerForm";
import ScheduleForm from "./form/ScheduleForm";

function ComputersComponent() {
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(false);
  // New state to keep track of the edit type
  const [editType, setEditType] = useState(null); // 'computer' or 'schedule'

  const functions = useFunctions();
  const firestore = useFirestore();
  const toast = useToast();

  const permanmentlyDestroyUser = httpsCallable(functions, "deleteComputer");

  const computersRef = collection(firestore, "computers");
  const { data: computers, status } = useFirestoreCollectionData(computersRef, {
    idField: "id",
  });

  const handleComputerDelete = async (uid) => {
    try {
      const response = await permanmentlyDestroyUser({ uid });
      toast({
        title: response.data.message,
        status: response.data.status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComputerClick = (rowId) => {
    handleEditClick(rowId, "computer");
  };

  const handleEditScheduleClick = (rowId) => {
    handleEditClick(rowId, "schedule");
  };

  const handleEditClick = (rowId, type) => {
    const value = computers.filter((row) => row.id === rowId);
    if (value.length) {
      setOpen(true);
      setEditValue({ ...value[0] });
      setEditType(type); // Set the edit type here
    } else {
      toast({
        title: "Computer not found",
        status: "warning",
      });
    }
  };

  const handleComputerCreate = () => {
    setEditType("computer");
    setEditValue(false);
    setOpen(true);
  };

  if (!status === "success") return <Spinner />;

  return (
    <>
      <ModalContainer
        isOpen={open}
        setIsOpen={setOpen}
        form={
          editType === "computer" ? (
            <ComputerForm setIsOpen={setOpen} values={editValue} />
          ) : (
            <ScheduleForm setIsOpen={setOpen} values={editValue} />
          )
        }
      />

      <Flex
        direction="row"
        height="30px"
        justifyContent="left"
        alignItems="center"
        my={4}
      >
        <Button
          variant="brand"
          size="xs"
          leftIcon={<MdAdd />}
          onClick={handleComputerCreate}
        >
          Add a new Computer
        </Button>
      </Flex>

      {/* TODO: Make this a component!! */}
      <Grid templateColumns="3fr 3fr 1fr 1fr 1fr 2fr">
        {/** Header Row */}
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Computer Name
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            IP Address
          </Text>
        </GridItem>
        {/* <GridItem>
                    <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">Phone</Text>
                </GridItem> */}
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            # Schedule
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Actions
          </Text>
        </GridItem>
      </Grid>
      <Divider my={2} />
      {/* Data rows */}
      {computers &&
        computers.map((computer) => (
          <React.Fragment key={computer.id}>
            <Grid templateColumns="3fr 3fr 1fr 1fr 1fr 2fr">
              <GridItem>
                <Text fontSize="sm">{computer.computerName}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="sm">{computer.ipAddress}</Text>
              </GridItem>

              <GridItem>
                <Text fontSize="sm">
                  {Object.keys(computer.schedule)
                    .filter((day) => computer.schedule[day].length > 0)
                    .join(", ")}
                </Text>
              </GridItem>

              <GridItem>
                <Tooltip label="Edit PC">
                  <IconButton
                    onClick={() => handleEditComputerClick(computer.id)}
                    size="sm"
                    icon={<MdEdit />}
                    mr={3}
                  />
                </Tooltip>
                <Tooltip label="Edit Schedule">
                  <IconButton
                    onClick={() => handleEditScheduleClick(computer.id)}
                    size="sm"
                    icon={<MdEdit />}
                    mr={3}
                  />
                </Tooltip>
                <ConfirmModal
                  tooltipLabel="Permanently Delete"
                  destructiveFunction={() => handleComputerDelete(user.id)}
                />
              </GridItem>
            </Grid>
            <Divider my={2} />
          </React.Fragment>
        ))}
    </>
  );
}

export default ComputersComponent;
