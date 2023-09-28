import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TasksScreen from "../screens/TasksScreen";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootStackParamList from "./NavigationTypes";

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const removeAccessToken = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Error removing accessToken:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerLeft: () => null }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            headerLeft: () => null,
            headerRight: () => {
              const navigation = useNavigation();
              return (
                <IconButton
                  icon="logout"
                  onPress={() => {
                    removeAccessToken();
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" as never }],
                    });
                  }}
                  iconColor="#E75C67"
                  style={{ marginRight: 16 }}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ headerTitle: "New Task" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
