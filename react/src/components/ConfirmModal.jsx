import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";

const ConfirmModal = ({
  destructiveFunction,
  title = "Are you sure you want to delete this? You can't undo this action afterwards.",
  iconSize = "xs",
  iconVariant = "solid",
  iconZIndex = "auto",
  iconTransform = "scale(1)",
  tooltipLabel = "Delete Item",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleConfirm = () => {
    destructiveFunction();
    onClose();
  };

  return (
    <>
      <Tooltip label={tooltipLabel}>
        <IconButton
          zIndex={iconZIndex}
          variant={iconVariant}
          colorScheme="red"
          size={iconSize}
          icon={<MdDelete transform={iconTransform} />}
          onClick={onOpen}
        />
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>

            <AlertDialogBody>{title}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmModal;
