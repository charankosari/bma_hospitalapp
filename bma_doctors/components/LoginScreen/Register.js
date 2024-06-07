import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState("hospital");

  const handleRegister = async () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // setLoading(true);

    // try {
    //   const response = await fetch("https://server.bookmyappointments.in/api/bma/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ name, email, number: phoneNumber }),
    //   });

    //   const data = await response.json();

    //   if (response.status === 200) {
    //     navigation.navigate("Otp", { number: data.number });
    //   } else {
    //     console.log(data)
    //     Alert.alert("Error", data.error || "Registration failed");
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Failed to register, please try again");
    // } finally {
    //   setLoading(false);
    // }
    navigation.replace("Otp");
  };
  const pickImage = async () => {
    // Ask the user for the permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.uri); // Log the image URI to the console
    }
  };

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Text style={{ fontSize: 36, marginBottom: 24 }}>Register </Text>
          <View style={{ width: "100%", marginBottom: 24 }}>
            <TextInput
              placeholder="Hospital name or Lab name"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />

            <TextInput
              placeholder="Email"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput
              placeholder="Address"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={address}
              onChangeText={setAddress}
              editable={!loading}
            />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={{
                height: 40,
                borderColor: "#ccc",
                borderBottomWidth: 1,
                marginBottom: 12,
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text style={{ flex: 1, fontSize: 16, marginRight: 10 }}>
                Select:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "row", width: "70%" }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 7,
                    borderLeftWidth: 1,
                    backgroundColor:
                      selectedItem === "hospitals" ? "#2BB673" : "transparent",
                    borderTopRightRadius: selectedItem === "hospitals" ? 0 : 10,
                    borderBottomRightRadius:
                      selectedItem === "hospitals" ? 0 : 10,
                  }}
                  onPress={() => setSelectedItem("hospitals")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: selectedItem === "hospitals" ? "#fff" : "#000",
                    }}
                  >
                    Hospitals
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 7,
                    borderRightWidth: 1,
                    backgroundColor:
                      selectedItem === "labs" ? "#2BB673" : "transparent",
                    borderTopLeftRadius: selectedItem === "labs" ? 0 : 10,
                    borderBottomLeftRadius: selectedItem === "labs" ? 0 : 10,
                  }}
                  onPress={() => setSelectedItem("labs")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: selectedItem === "labs" ? "#fff" : "#000",
                    }}
                  >
                    Labs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 40 }}>
                Upload Profile
                <Text style={{ fontSize: 14, color: "gray", marginLeft: 1 }}>
                  (Optional) :
                </Text>
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: "#007BFF",
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 30,
                }}
                onPress={pickImage}
              >
                <Text style={{ color: "#fff" }}>Upload</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              style={{
                backgroundColor: loading ? "#ccc" : "#4CAF50",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 4,
                alignItems: "center",
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text
                  style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
                >
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 24,
                fontSize: 16,
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Text
                onPress={() => navigation.push("Login")}
                style={{ color: "#4CAF50", textDecorationLine: "underline" }}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
