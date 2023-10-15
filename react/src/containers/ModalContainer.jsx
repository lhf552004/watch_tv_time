import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const ModalContainer = ({ title = "", isOpen, setIsOpen, form }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>{form}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ModalContainer;
