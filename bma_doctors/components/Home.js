import React, { useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./UserScreens/HomeScreen";
import SettingsScreen from "./UserScreens/SettingsScreen";
import { ActivityIndicator, View } from "react-native";

const Tab = createMaterialBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }
  return (
    <Tab.Navigator barStyle={{ backgroundColor: "white" }} shifting={false}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#2BB673" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? "#2BB673" : "gray"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;