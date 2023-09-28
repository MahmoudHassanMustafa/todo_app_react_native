import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Register: undefined; 
  Login: undefined; 
  Tasks: undefined; 
  AddTask: undefined;
};

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type TasksScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tasks"
>;

export type AddTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddTask"
>;

export default RootStackParamList;
