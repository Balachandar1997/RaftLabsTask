import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../app/(tabs)/Home"; // Assuming HomeScreen is created
import BookingsScreen from "../app/(tabs)/Booking"; // Assuming BookingsScreen is created
import ProfileScreen from "../app/(tabs)/Profile"; // Assuming ProfileScreen is created
import { Ionicons } from "@expo/vector-icons"; // Optional, for icons
import PropertyDetails from "@/components/property/Propertydetails";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the header for each screen
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}
