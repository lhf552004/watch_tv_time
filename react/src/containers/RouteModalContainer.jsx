import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const RouteModalContainer = ({ title = "", form }) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={true} onClose={() => navigate(-1)} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>{form}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default RouteModalContainer;
