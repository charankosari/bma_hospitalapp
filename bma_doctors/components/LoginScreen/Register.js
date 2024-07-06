import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    };

    getLocation();
  }, []);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!name || !email || !phoneNumber || !selectedItem) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!address || !pincode || !city) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    let imageUrl = "";
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", {
          uri: image.assets[0].uri,
          name: image.assets[0].fileName,
          type: image.assets[0].mimeType,
        });

        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/hospital/profileupload",
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const data = await response.json();
        console.log("Image upload response:", data);

        if (response.status !== 200) {
          throw new Error(data.error || "Failed to upload image");
        }

        imageUrl = data.url;
        console.log("Image URL:", imageUrl);
      }

      const body = {
        hospitalName: name,
        address: {
          hospitalAddress: address,
          pincode,
          city,
          latitude,
          longitude,
        },
        number: phoneNumber,
        email,
        role: selectedItem === "hospitals" ? "hospital" : "lab",
        image: imageUrl,
      };

      console.log("Sending registration data:", body);

      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.status === 200) {
        setSuccessAlert(true);
        setTimeout(() => {
          navigation.navigate("Otp", { data: body });
        }, 1000);
      } else {
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to register, please try again");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result);
      console.log(result);
    }
  };

  const handleMessage = (event) => {
    const { data } = event.nativeEvent;
    const coordinates = JSON.parse(data);
    setLatitude(coordinates.latitude);
    setLongitude(coordinates.longitude);
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Select Location</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #map {
          height: 100%;
        }
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${latitude || 17.387140}, ${longitude || 78.491684}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: ''
        }).addTo(map);
        
        var marker = L.marker([${latitude || 17.387140}, ${longitude || 78.491684}], { draggable: true }).addTo(map);
        
        marker.on('dragend', function(event) {
          var position = marker.getLatLng();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            latitude: position.lat,
            longitude: position.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ width: Dimensions.get("window").width * 0.8 }}>
              <Text style={{ fontSize: 36, marginBottom: 24 }}>REGISTER</Text>
              {currentStep === 1 && (
                <View>
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
                      marginBottom: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedItem("hospitals")}
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: selectedItem === "hospitals" ? "#2BB673" : "#ccc",
                        borderRadius: 5,
                        alignItems: "center",
                        marginRight: 10,
                      }}
                      disabled={loading}
                    >
                      <Text style={{ color: "white" }}>Hospital</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedItem("labs")}
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: selectedItem === "labs" ? "#2BB673" : "#ccc",
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                      disabled={loading}
                    >
                      <Text style={{ color: "white" }}>Lab</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handleNextStep} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#2BB673",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Next</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {currentStep === 2 && (
                <View>
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
                    placeholder="Pincode"
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderBottomWidth: 1,
                      marginBottom: 12,
                      paddingHorizontal: 8,
                      fontSize: 16,
                    }}
                    value={pincode}
                    onChangeText={setPincode}
                    editable={!loading}
                  />
                  <TextInput
                    placeholder="City"
                    style={{
                      height: 40,
                      borderColor: "#ccc",
                      borderBottomWidth: 1,
                      marginBottom: 12,
                      paddingHorizontal: 8,
                      fontSize: 16,
                    }}
                    value={city}
                    onChangeText={setCity}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={handlePrevStep} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#6c757d",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Back</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextStep} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#2BB673",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Next</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {currentStep === 3 && (
                <View>
                  <View style={{ height: 300, marginBottom: 12 }}>
                    <WebView
                      originWhitelist={["*"]}
                      source={{ html: mapHtml }}
                      onMessage={handleMessage}
                    />
                  </View>
                  <TouchableOpacity onPress={handlePrevStep} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#6c757d",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Back</Text>
                    </View>
                  </TouchableOpacity>
                  {loading && <ActivityIndicator size="large" color="#007bff" />}
                  <TouchableOpacity onPress={pickImage} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#2BB673",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        {image ? "Change Image" : "Upload Image (Optional)"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleRegister} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#2BB673",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Register</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {image && (
                    <Image
                      source={{ uri: image.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;