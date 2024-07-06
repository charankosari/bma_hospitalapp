import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {  useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpScreen = ({navigation}) => {
  const route = useRoute();
  const { data } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const otpInputs = Array.from({ length: 4 }, () => useRef(null));

  const handleOtpInput = (index, value) => {
    const updatedOtp = [...otp];
    if (value.length <= 1 && /\d/.test(value)) {
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value.length === 1 && index < 3) {
        otpInputs[index + 1].current.focus();
      }
    } else if (value === "") {
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (index > 0) {
        otpInputs[index - 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      const updatedOtp = [...otp];
      updatedOtp[index - 1] = "";
      setOtp(updatedOtp);
      otpInputs[index - 1].current.focus();
    } else if (e.nativeEvent.key === "Backspace" && otp[index] !== "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
    }
  };
  const handleVerifyNow = async () => {
    setLoading(true);
  
    const otpNumber = Number(otp.join(""));
    const payload = {
      otp: otpNumber,
      number: data.number,
      hospitalName: data.hospitalName,
      address: data.address,
      email: data.email,
      image: data.image,
      role: data.role
    };
  
    const url = "https://server.bookmyappointments.in/api/bma/hospital/verifyregisterotp";
    try {
      console.log(JSON.stringify(payload));
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      console.log("Verification response:", responseData);
      if (responseData.success) {
        await AsyncStorage.setItem("jwtToken", responseData.jwtToken);
        await AsyncStorage.setItem("hospitalId", responseData.hosp._id);
        console.log("JWT Token:", responseData.jwtToken);
        console.log("Hospital ID:", responseData.hosp._id);
        navigation.replace("HomeScreen");
      } else {
        Alert.alert("Error", responseData.error || "Invalid response from server");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        We have sent you the code
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpInputs[index]}
            style={{
              borderWidth: 1,
              borderColor: "#2BB673",
              width: 50,
              height: 50,
              fontSize: 20,
              textAlign: "center",
              marginRight: 10,
            }}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(value) => handleOtpInput(index, value)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            editable={!loading}
          />
        ))}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: loading ? "#ccc" : "#2BB673",
          paddingHorizontal: 20,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: '60%',
        }}
        onPress={handleVerifyNow}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: "white", alignItems: "center", fontSize: 18 }}>
            Verify Now
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;
