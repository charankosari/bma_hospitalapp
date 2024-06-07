import React, { useState, useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./UserScreens/HomeScreen";
import SettingsScreen from "./UserScreens/SettingsScreen";
import { ActivityIndicator, View, Alert } from "react-native";

const Tab = createMaterialBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const checkJwtToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("jwtToken");
  //       if (token) {
  //         const response = await fetch(
  //           "https://server.bookmyappointments.in/api/bma/me",
  //           {
  //             method: "GET",
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         const data = await response.json();

  //         if (data.success) {
  //           await AsyncStorage.setItem("userData", JSON.stringify(data.user));
  //           setUser(data.user); 
  //         } else {
  //           Alert.alert("Error", "Failed to fetch user data, please log in again.");
  //           navigation.navigate("Login");
  //         }
  //       } else {
  //         navigation.navigate("Login");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       navigation.navigate("Login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkJwtToken();
  // }, [navigation]);

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

  // if (!user) {
  //   return null;
  // }


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
        // initialParams={{ user }}
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
        // initialParams={{ user }}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;