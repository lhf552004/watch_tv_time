import {
  useFirestoreCollectionData,
  useFunctions,
  useFirestore,
  useUser,
} from "reactfire";
import { collection, doc, query, where, deleteDoc } from "firebase/firestore";
import React, { useState } from "react";
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

import Spinner from "./commons/Spinner";
import ModalContainer from "../containers/ModalContainer";
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";
import ConfirmModal from "./commons/ConfirmModal";
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

  const { data: user } = useUser();

  // Create a query to fetch computers for the current user
  const computersRef = collection(firestore, "computers");

  const computersQuery = query(computersRef, where("ownerId", "==", user.uid));

  // Fetch the data using the query
  const { data: computers } = useFirestoreCollectionData(computersQuery, {
    idField: "id",
  });

  // Delete a computer with id
  const handleComputerDelete = async (uid) => {
    try {
      await deleteDoc(doc(firestore, "computers", uid));
      toast({
        title: `Delete doc with id ${uid} successfully`,
        status: "success",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: `Delete doc with id ${uid} failed. with error: ${error}`,
        status: "error",
      });
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
                  destructiveFunction={() => handleComputerDelete(computer.id)}
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
