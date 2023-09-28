import React, { useState } from "react";
import { View, StyleSheet, ListRenderItemInfo } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { Task, useTasksContext } from "../contexts/TasksContext";
import TaskListItem from "../components/TaskListItem";
import { TasksScreenNavigationProp } from "../navigation/NavigationTypes";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const TasksScreen: React.FC<{
  navigation: TasksScreenNavigationProp;
}> = ({ navigation }) => {
  const { tasks, deleteTask, toggleComplete, isLoading } = useTasksContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const showDeleteConfirmationModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteModalVisible(true);
  };

  const hideDeleteConfirmationModal = () => {
    setSelectedTaskId(null);
    setDeleteModalVisible(false);
  };

  const confirmTaskDeletion = () => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId);
      hideDeleteConfirmationModal();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingIndicatorBox}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item: Task): string => item.id}
          renderItem={({ item }: ListRenderItemInfo<Task>) => (
            <TaskListItem
              task={item}
              onCheck={toggleComplete}
              onDelete={(): void => showDeleteConfirmationModal(item.id)}
            />
          )}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        label="New Task"
        onPress={(): void => navigation.navigate("AddTask")}
      ></FAB>
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onConfirm={confirmTaskDeletion}
        onCancel={hideDeleteConfirmationModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  taskItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  taskTitle: {},
  taskDescription: {},
  taskDueDateContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  loadingIndicatorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TasksScreen;
