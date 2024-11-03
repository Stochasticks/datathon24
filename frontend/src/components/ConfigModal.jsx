import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const ConfigModal = ({
  isOpen,
  onClose,
  title,
  content,
  width = "auto",
  height = "auto",
  noFooter,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        style={{
          width: width,
          height: height,
          maxWidth: "none", // To avoid Chakra's default maxWidth
          maxHeight: "none", // To avoid Chakra's default maxHeight
        }}
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
        <ModalFooter>
          {!noFooter && (
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfigModal;
