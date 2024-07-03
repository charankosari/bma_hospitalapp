import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
// import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OtpScreen = ({ navigation }) => {
  // const route = useRoute();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [hid,setHid]=useState('')
  const otpInputs = Array.from({ length: 4 }, () => useRef(null));
  // const { hospid } = route.params; 


  useEffect(() => {
    async function countdown() {
      if (timer > 0) {
        const countdownInterval = setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval(countdownInterval);
      }
    }
    countdown();
  }, [timer]);
  useEffect(() => {
    const getHospId = async () => {
      const hospid = await AsyncStorage.getItem("hospid");
      setHid(hospid);
    };
    getHospId();
  }, []);

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
    const url = "https://server.bookmyappointments.in/api/bma/hospital/verifyotp";
    const payload = { hospid:hid, otp: otpNumber };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const responseData = JSON.parse(responseText);

      if (responseData.success) {
        await AsyncStorage.setItem("jwtToken", responseData.jwtToken);
        await AsyncStorage.removeItem("number");
        navigation.replace("HomeScreen");
      } else {
        Alert.alert("Error", responseData.message || "Invalid response from server");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: await AsyncStorage.getItem("number") }),
      });

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
          marginBottom: 20,
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
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          paddingVertical: 10,
          borderRadius: 5,
          width: '60%',
        }}
        onPress={handleResendOtp}
        disabled={resendLoading || timer > 0}
      >
        {resendLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={{ color: resendLoading || timer > 0 ? "red" : "#2BB673", alignItems: "center", fontSize: 18 }}>
            Resend OTP {timer > 0 && `(${timer}s)`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;