import "react-native-gesture-handler";
import React from "react";
import Navigation from "./src/navigation/Navigation";
import { TasksProvider } from "./src/contexts/TasksContext";

const App: React.FC = () => {
  return (
    <TasksProvider>
      <Navigation />
    </TasksProvider>
  );
};

export default App;
