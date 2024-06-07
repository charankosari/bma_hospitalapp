import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KeyboardAwareScrollViewComponent = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const jwtToken = await AsyncStorage.getItem("jwtToken");
  //       console.log("JWT Token:", jwtToken);
  //       if (jwtToken) {
  //         navigation.push("HomeScreen");
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving JWT token:", error);
  //     }
  //   };

  //   checkToken();
  // }, [navigation]);

  const handleSendOtp = async () => {
    // setLoading(true);
    // try {
    //   const response = await fetch("https://server.bookmyappointments.in/api/bma/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ number: mobileNumber }),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     const userId = data.userid;
    //     navigation.navigate("OtpLogin", { userId });
    //   } else {
    //     Alert.alert("Error", data.error);
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to send OTP, please try again");
    // } finally {
    //   setLoading(false);
    // }
    navigation.navigate("OtpLogin")
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 36, marginBottom: 24 }}>Login </Text>
          <View style={{ width: "100%", marginBottom: 24 }}>
            <TextInput
              placeholder="Enter your mobile number..."
              textContentType="oneTimeCode"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              editable={!loading}
            />
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleSendOtp}
                style={{
                  backgroundColor: loading ? "#ccc" : "#2BB673",
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  width: '60%',
                  alignItems: "center",
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
                    Send OTP
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: 24,
                fontSize: 16,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <Text
                onPress={() => navigation.push("Register")}
                style={{ color: "#2BB673", textDecorationLine: "underline" }}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAwareScrollViewComponent;
