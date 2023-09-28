import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SERVER_URL } from "../../config";

export interface Task {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: string;
}

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  fetchTasks: () => void;
  updateTask: (taskId: string, updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleComplete: (taskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
};

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add isLoading state

  const addTask = (task: Task | Task[]): void => {
    if (Array.isArray(task)) {
      setTasks([...tasks, ...task]);
    } else {
      setTasks([...tasks, task]);
    }
  };

  const fetchTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const apiUrl: string = `${SERVER_URL}/task/feed`;

      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = (taskId: string, updatedTask: Task): void => {
    setTasks((prevTasks: Task[]): Task[] => {
      return prevTasks.map(
        (task: Task): Task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
      );
    });
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    if (!taskToDelete) {
      return;
    }

    setTasks((prevTasks: Task[]): Task[] =>
      prevTasks.filter((task) => task.id !== taskId)
    );

    try {
      const apiUrl: string = `${SERVER_URL}/task/${taskId}`;

      const accessToken = await AsyncStorage.getItem("accessToken");
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (taskId: string): Promise<void> => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const taskToToggle = tasks.find((task) => task.id === taskId);
      if (!taskToToggle) {
        return;
      }

      const updatedTasks = tasks.map((task: Task) =>
        task.id === taskId ? { ...task, isComplete: !task.isComplete } : task
      );
      setTasks(updatedTasks);

      const apiUrl: string = `${SERVER_URL}/task/${taskId}`;

      await axios.patch(
        apiUrl,
        { isComplete: !taskToToggle.isComplete },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect((): void => {
    fetchTasks();
  }, []);

  const value: TasksContextType = {
    tasks,
    isLoading,
    addTask,
    fetchTasks,
    updateTask,
    deleteTask,
    toggleComplete,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export default TasksContext;
