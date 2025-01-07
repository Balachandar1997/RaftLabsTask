import React from "react";
import { AppRegistry } from "react-native"; // For Expo, it can be used in an Expo-managed project
import App from "../App"; // Your App component, which will hold the navigation logic

AppRegistry.registerComponent("main", () => App);

export default function Root() {
  return (
    <App />
  );
}
