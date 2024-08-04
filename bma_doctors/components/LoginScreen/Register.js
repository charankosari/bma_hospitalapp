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
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MaterialIcons } from "@expo/vector-icons";
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(17.38714);
  const [longitude, setLongitude] = useState(78.491684);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleLocationSelect = (data, details) => {
    const { geometry } = details;
    setLatitude(geometry.location.lat);
    setLongitude(geometry.location.lng);
  };

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
        if (response.status !== 200) {
          throw new Error(data.error || "Failed to upload image");
        }
        imageUrl = data.url;
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

      if (response.status === 200) {
        setSuccessAlert(true);
        setTimeout(() => {
          navigation.replace("Otp", { data: body });
        }, 1000);
      } else {
        Alert.alert("Error", data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to register, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

 const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const fileSizeInBytes = result.assets[0].fileSize; // Assuming the file size is available
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMB > 2) {
      alert('The selected image is larger than 2MB. Please select a smaller image.');
      return;
    }
    setImage(result);
  }
  };

  return (
    <View style={{ flex: 1,backgroundColor:'#ffffff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
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
                        backgroundColor:
                          selectedItem === "hospitals" ? "#2BB673" : "#ccc",
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
                        backgroundColor:
                          selectedItem === "labs" ? "#2BB673" : "#ccc",
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
                    keyboardType="number-pad"
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{ textAlign: "center",fontWeight:'bold' }}>
                      Pick an image (optional) :
                    </Text>
                    <TouchableOpacity onPress={pickImage} disabled={loading}>
                      <View
                        style={{
                          backgroundColor: image?"#ffffff":"#2BB673",
                          padding: 10,
                          borderRadius: 5,
                          alignItems: "center",
                        }}
                      >
                        {!image ? (
                          <Text style={{ color: "white", fontSize: 16 }}>
                            Pick an Image
                          </Text>
                        ) : (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={{ uri: image.assets[0].uri }}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 5,
                                marginRight: 5,
                              }}
                            />
                            <TouchableOpacity onPress={()=>{setImage(null)}}>
                              <MaterialIcons
                                name="cancel"
                                size={24}
                                color="red"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
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
                  <TouchableOpacity onPress={handlePrevStep} disabled={loading}>
                    <View
                      style={{
                        backgroundColor: "#ccc",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Previous
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {currentStep === 3 && (
                <>
                  <View style={{ flex: 1, padding: 1 }}>
                    <GooglePlacesAutocomplete
                      placeholder="Search location"
                      onPress={(data, details = null) =>
                        handleLocationSelect(data, details)
                      }
                      query={{
                        key: "AIzaSyB_hbFsqNsWp1KKR-8qcYDq5sl2vLZeohw",
                        language: "en",
                      }}
                      fetchDetails={true}
                      styles={{
                        textInputContainer: {
                          width: "100%",
                          backgroundColor: "#FFF",
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          marginBottom: 10,
                        },
                        textInput: {
                          height: 40,
                          color: "#5d5d5d",
                          fontSize: 16,
                        },
                        listView: {
                          backgroundColor: "white",
                          borderRadius: 5,
                          elevation: 3,
                          marginTop: 5,
                          overflow: "hidden",
                          paddingHorizontal: 5,
                        },
                        row: {
                          padding: 13,
                          height: 44,
                          flexDirection: "row",
                          alignItems: "center",
                          borderBottomColor: "#eee",
                          borderBottomWidth: 1,
                          overflow: "hidden",
                        },
                        separator: {
                          height: 0.5,
                          backgroundColor: "#c8c7cc",
                        },
                        description: {
                          fontSize: 15,
                          color: "#000",
                        },
                      }}
                      nearbyPlacesAPI="GooglePlacesSearch"
                      debounce={200}
                    />

                    <Text
                      style={{
                        marginVertical: 8,
                        color: "#555",
                        textAlign: "center",
                      }}
                    >
                      Hold and drag the marker to adjust.
                    </Text>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={{
                        width: "100%",
                        height: 300,
                        marginVertical: 12,
                      }}
                      region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude,
                          longitude,
                        }}
                        draggable
                        onDragEnd={(e) => {
                          setLatitude(e.nativeEvent.coordinate.latitude);
                          setLongitude(e.nativeEvent.coordinate.longitude);
                        }}
                      />
                    </MapView>

                    <TouchableOpacity
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      <View
                        style={{
                          backgroundColor: "#2BB673",
                          padding: 10,
                          borderRadius: 5,
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={{ color: "white", fontSize: 16 }}>
                            Register
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handlePrevStep}
                      disabled={loading}
                    >
                      <View
                        style={{
                          backgroundColor: "#ccc",
                          padding: 10,
                          borderRadius: 5,
                          alignItems: "center",
                          marginTop: 12,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 16 }}>
                          Previous
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
