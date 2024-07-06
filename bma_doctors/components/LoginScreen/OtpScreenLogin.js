import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPInputView from '@twotalltotems/react-native-otp-input'

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hid, setHid] = useState("");

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(countdownInterval);
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    const getHospId = async () => {
      const hospid = await AsyncStorage.getItem("hospitalId");
      setHid(hospid);
    };
    getHospId();
  }, []);

  const handleVerifyNow = async () => {
    if (otp.length === 4) {
      setLoading(true);
      const otpNumber = Number(otp);
      const url =
        "https://server.bookmyappointments.in/api/bma/hospital/verifyotp";
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
    setResendLoading(true);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: await AsyncStorage.getItem("number") }),
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
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        We have sent you the code
      </Text>
      <OTPInputView
        style={{ width: "80%", height: 200 }}
        pinCount={4}
        autoFocusOnLoad
        codeInputFieldStyle={{
          width: 50,
          height: 50,
          borderWidth: 1,
          borderColor: "#2BB673",
          borderRadius: 5,
          fontSize: 20,
          color:'black'
        }}
        codeInputHighlightStyle={{
          borderColor: "#000",
        }}
        onCodeFilled={(code) => {
          setOtp(code);
        }}
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
    </View>
  );
};

export default OtpScreen;