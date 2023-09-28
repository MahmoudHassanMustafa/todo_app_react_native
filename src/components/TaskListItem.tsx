import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Checkbox, IconButton } from "react-native-paper"; // Assuming you're using react-native-paper

const TaskListItem = ({ task, onCheck, onDelete }) => {
  return (
    <TouchableOpacity style={styles.listItem} onPress={() => onCheck(task.id)}>
      <View style={styles.checkboxContainer}>
        <Checkbox.Android
          status={task.isComplete ? "checked" : "unchecked"}
          onPress={() => onCheck(task.id)}
        />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.taskTitleBox}>
          <MaterialIcons name="title" size={20} />
          <Text style={[styles.title, task.isComplete && styles.crossedOutText]}>{task.title}</Text>
        </View>
        {task.description && (
          <View style={styles.descriptionBox}>
            <Text style={[styles.description, task.isComplete && styles.crossedOutText]}>{task.description}</Text>
          </View>
        )}
        {task.dueDate && (
          <View style={styles.taskDueDateBox}>
            <MaterialIcons name="timer" size={20} />
            <Text style={[styles.dueDate, task.isComplete && styles.crossedOutText ]}>{task.dueDate}</Text>
          </View>
        )}
      </View>
      <IconButton
        icon="delete"
        iconColor="#E75C67"
        size={28}
        onPress={() => onDelete(task.id)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#080808",
  },
  dueDate: {
    fontSize: 14,
    color: "#777",
  },
  taskTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taskDueDateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  descriptionBox: {
    margin: 8,
  },
  crossedOutText: {
    textDecorationLine: "line-through",
  },
});

export default TaskListItem;
