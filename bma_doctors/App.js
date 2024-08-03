import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./components/LoginScreen/Login";
import Register from "./components/LoginScreen/Register";
import OtpScreen from "./components/LoginScreen/OtpScreen";
import OtpScreenLogin from "./components/LoginScreen/OtpScreenLogin";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "./components/Home";
import Ho from "./components/UserScreens/HomeScreen"
import Se from "./components/UserScreens/SettingsScreen"
import Accountdetails from './components/SettingsScreens/Accountdetails'
import HelpSupport from './components/SettingsScreens/HelpSupport'
import DoctorPreview from "./components/DoctorScreens/DoctorPreview";
import AddDoctors from "./components/DoctorScreens/AddDoctors";
import MyBookings from "./components/Bookings";
import AddTests from './components/TestsScreen/AddTests'
import TestPreview from './components/TestsScreen/TestPreview'
import BookingTests from './components/TestsScreen/BookingsTests'
import { enableScreens } from 'react-native-screens';
import TermsAndConditions from './components/SettingsScreens/TermsAndConditions'
import PrivacyPolicy from './components/SettingsScreens/PrivacyPolicy'
enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000); 
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, gestureEnabled: false }}
        />
         <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpLogin"
          component={OtpScreenLogin}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false, gestureEnabled: false  }}
        />
        <Stack.Screen
          name="Otp"
          component={OtpScreen}
          options={{ headerShown: false, gestureEnabled: false  }}
        />
     <Stack.Screen
          name="Ho"
          component={Ho}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Se"
          component={Se}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Account Details"
          component={Accountdetails}
        />
        <Stack.Screen
          name="Help and Support"
          component={HelpSupport}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Doctor Preview"
          component={DoctorPreview}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add doctor"
          component={AddDoctors}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add test"
          component={AddTests}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Test preview"
          component={TestPreview}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="My Bookings"
          component={BookingTests}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Terms and conditions"
          component={TermsAndConditions}
        />
        <Stack.Screen
          name="Privacy Policy"
          component={PrivacyPolicy}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
