import React from "react";
import { Modal, Text, Button, View, StyleSheet } from "react-native";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>
            Are you sure you want to delete this task?
          </Text>
          <View style={styles.buttonsContainer}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Delete" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    width: 300, // Set the width as desired
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
});

export default DeleteConfirmationModal;
