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
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { IconButton } from "@chakra-ui/react";

import ModalContainer from "../containers/ModalContainer";
import Spinner from "./commons/Spinner";
import ConfirmModal from "./commons/ConfirmModal";
import UserForm from "./form/UserForm";

function UsersComponent() {
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(false);

  const functions = useFunctions();
  const firestore = useFirestore();
  const toast = useToast();

  const callKillUser = httpsCallable(functions, "disableUser");
  const permanmentlyDestroyUser = httpsCallable(functions, "deleteUser");

  const usersRef = collection(firestore, "users");
  const { data: users, status } = useFirestoreCollectionData(usersRef, {
    idField: "id",
  });

  const handleUserDisable = async (uid, status) => {
    try {
      const response = await callKillUser({ uid, status });
      toast({
        title: response.data.message,
        status: response.data.status,
      });
    } catch (error) {
      toast({
        title: error.result.title,
        message: error.result.message,
      });
    }
  };

  const handleUserDelete = async (uid) => {
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

  const handleEditClick = (rowId) => {
    const value = users.filter((row) => row.id === rowId);
    if (value.length) {
      setOpen(true);
      setEditValue({
        ...value[0],
      });
    } else {
      toast({
        title: "User not found",
        status: "warning",
      });
    }
  };

  const handleUserCreate = () => {
    setEditValue(false);
    setOpen(true);
  };

  if (!status === "success") return <Spinner />;

  return (
    <>
      <ModalContainer
        isOpen={open}
        setIsOpen={setOpen}
        form={<UserForm setIsOpen={setOpen} values={editValue} />}
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
          onClick={handleUserCreate}
        >
          Add a new Member
        </Button>
      </Flex>

      {/* TODO: Make this a component!! */}
      <Grid templateColumns="3fr 3fr 1fr 1fr 1fr 2fr">
        {/** Header Row */}
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Name
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Email
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Admin
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
            Disabled
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
      {users &&
        users.map((user) => (
          <React.Fragment key={user.id}>
            <Grid templateColumns="3fr 3fr 1fr 1fr 1fr 2fr">
              <GridItem>
                <Text fontSize="sm">{user.displayName}</Text>
              </GridItem>
              <GridItem>
                <Text fontSize="sm">{user.email}</Text>
              </GridItem>
              <GridItem>
                {user.isAdmin && <MdCheckCircle color="green" />}
              </GridItem>
              <GridItem>
                {user.disabled && <MdCheckCircle color="red" />}
              </GridItem>
              <GridItem>
                <Tooltip label="Edit User">
                  <IconButton
                    onClick={() => handleEditClick(user.id)}
                    size="sm"
                    icon={<MdEdit />}
                    mr={3}
                  />
                </Tooltip>
                {user.disabled ? (
                  <>
                    <Tooltip label="Enable User">
                      <IconButton
                        size="sm"
                        icon={<MdCheck />}
                        onClick={() =>
                          handleUserDisable(user.id, user.disabled)
                        }
                        mr={3}
                      />
                    </Tooltip>
                    <ConfirmModal
                      tooltipLabel="Permanently Delete"
                      destructiveFunction={() => handleUserDelete(user.id)}
                    />
                  </>
                ) : (
                  <Tooltip label="Disable User">
                    <IconButton
                      size="sm"
                      icon={<MdClose />}
                      onClick={() => handleUserDisable(user.id, user.disabled)}
                    />
                  </Tooltip>
                )}
              </GridItem>
            </Grid>
            <Divider my={2} />
          </React.Fragment>
        ))}
    </>
  );
}

export default UsersComponent;
