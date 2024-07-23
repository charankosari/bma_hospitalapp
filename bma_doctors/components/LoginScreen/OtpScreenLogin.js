import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';

const OtpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30); // Initial timer value
  const [hid, setHid] = useState("");
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const getHospId = async () => {
      const hospid = await AsyncStorage.getItem("hospitalId");
      setHid(hospid);
    };
    getHospId();
    handleReceivedOTP(""); // Assuming you're handling received OTP here
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyNow = async () => {
    if (otp.length === 4) {
      setLoading(true);
      const otpNumber = Number(otp);
      const url = "https://server.bookmyappointments.in/api/bma/hospital/verifyotp";
      const payload = { hospid: hid, otp: otpNumber };
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        if (response.ok && responseData.success) {
          await AsyncStorage.setItem("jwtToken", responseData.jwtToken);
          await AsyncStorage.setItem("hospitalId", responseData.hosp._id);
          await AsyncStorage.setItem(
            "role",
            responseData.hosp.role === "hospital" ? "hospital" : "lab"
          );
          await AsyncStorage.removeItem("number");
          navigation.replace("HomeScreen");
        } else {
          Alert.alert(
            "Error",
            responseData.message || "Invalid response from server"
          );
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Please enter a valid 4-digit OTP");
    }
  };

  const handleResendOtp = async () => {
    if (timer === 0) {
      setResendLoading(true);
      try {
        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/hospital/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              number: await AsyncStorage.getItem("number"),
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "OTP has been resent");
          setTimer(30); // Reset the timer
        } else {
          Alert.alert("Error", data.error);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to resend OTP, please try again");
      } finally {
        setResendLoading(false);
      }
    } else {
      Alert.alert("Info", `Please wait for ${timer} seconds before resending OTP`);
    }
  };

  const handleReceivedOTP = (receivedOTP) => {
    setOtp(receivedOTP); // Set the received OTP in state
  };

  // Custom renderCell function for different style
  const renderCustomCell = ({ index, symbol, isFocused }) => (
    <View
      key={index}
      style={{
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isFocused ? "#2BB673" : "#FFFFFF",
        borderWidth: 1,
        borderColor: isFocused ? "#2BB673" : "#000000",
        borderRadius: 10,
        margin: 10,
      }}
    >
      <Text style={{ fontSize: 24, color: isFocused ? "#FFFFFF" : "#000000" }}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        We have sent you the code
      </Text>
      <CodeField
        value={otp}
        onChangeText={(text) => {
          setOtp(text);
        }}
        cellCount={4}
        rootStyle={{ marginBottom: 20 }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCustomCell}
      />
      <TouchableOpacity
        style={{
          backgroundColor: loading ? "#ccc" : "#2BB673",
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: "60%",
          marginTop: 20,
        }}
        onPress={handleVerifyNow}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: "white", fontSize: 18 }}>Verify Now</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: "60%",
          marginTop: 10,
        }}
        onPress={handleResendOtp}
        disabled={resendLoading || timer > 0}
      >
        {resendLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={{
              color: resendLoading || timer > 0 ? "red" : "#2BB673",
              fontSize: 18,
            }}
          >
            Resend OTP {timer > 0 ? `(${timer}s)` : ""}
          </Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;