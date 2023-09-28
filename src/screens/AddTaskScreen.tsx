import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { IconButton, MD3Colors } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTasksContext, Task } from "../contexts/TasksContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { format, parseISO } from "date-fns";
import { AddTaskScreenNavigationProp } from "../navigation/NavigationTypes";
import { Keyboard } from "react-native";
import { SERVER_URL } from "../../config";

type AndroidMode = "date" | "time";

const AddTaskScreen: React.FC<{
  navigation: AddTaskScreenNavigationProp;
}> = ({ navigation }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const { addTask } = useTasksContext();
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    setDueDate(currentDate);
  };

  const showMode = (currentMode: AndroidMode | undefined) => {
    DateTimePickerAndroid.open({
      value: dueDate ?? new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = (): void => {
    showMode("date");
  };

  const showTimepicker = (): void => {
    showMode("time");
  };

  let newTask: Task;

  const formatDate = (dateString: string): string => {
    const date = parseISO(dateString);
    const formattedDate = format(date, "EEE dd LLL yy hh:mm a");
    return formattedDate;
  };

  const handleAddTask = async (): Promise<void> => {
    Keyboard.dismiss();
    if (!title.trim()) {
      // Ensure title is not empty
      alert("Please enter a title for the task.");
      return;
    }
    try {
      setIsLoading(true);
      const apiUrl: string = `${SERVER_URL}/task/new`;

      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.post(
        apiUrl,
        { title, description, dueDate },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const resData = response.data;
      console.log(response.data.dueDate);

      newTask = {
        id: resData.id,
        title: resData.title,
        description: resData.description,
        isComplete: resData.isComplete,
        dueDate: resData.dueDate ? formatDate(resData.dueDate) : undefined,
      };

      addTask(newTask);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title (required)</Text>
        <TextInput
          placeholder="Enter title"
          value={title}
          onChangeText={(text: string): void => setTitle(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Describe your task"
          value={description}
          onChangeText={(text: string): void => setDescription(text)}
          multiline
          numberOfLines={4}
        />
      </View>

      <SafeAreaView>
        <Text style={styles.label}>Due date (optional)</Text>
        <View style={styles.iconContainer}>
          <IconButton
            icon="calendar"
            iconColor="black"
            size={30}
            onPress={showDatepicker}
          />
          <Text style={styles.placeholder}>
            {dueDate ? dueDate.toLocaleString() : "Select Date & Time"}
          </Text>
          <IconButton
            icon="clock"
            iconColor="black"
            size={30}
            onPress={showTimepicker}
          />
        </View>
      </SafeAreaView>
      <Button title="Add Task" onPress={handleAddTask} />
      {isLoading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 18,
    marginRight: 16,
  },
  textarea: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
});

export default AddTaskScreen;
