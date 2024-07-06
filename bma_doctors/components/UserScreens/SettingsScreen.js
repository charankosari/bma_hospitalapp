import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const SettingsScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [image, setImage] = useState(null);
  const [hosp, setHosp] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHospitalDetails = async () => {
    const token = await AsyncStorage.getItem("jwtToken");
    if (!token) {
      navigation.replace("Login");
      return;
    }

    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfileImage(data.hosp.image[0]);
        setHospitalName(data.hosp.hospitalName);
        setHosp(data);
      } else {
        alert("Failed to fetch hospital details");
      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHospitalDetails();
    }, [])
  );

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult);
      uploadImage(pickerResult);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", {
      uri: image.assets[0].uri,
      name: image.assets[0].fileName,
      type: image.assets[0].mimeType,
    });

    try {
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

      const textResponse = await response.text();
      console.log("Upload Image Response Text:", textResponse);

      const data = JSON.parse(textResponse);
      console.log("Upload Image Response JSON:", data);

      if (response.ok) {
        const token = await AsyncStorage.getItem("jwtToken");
        console.log("Updating profile with image URL:", data.url);
        const imageurl = data.url;

        try {
          const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/me/profileupdate", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageurl }),
          });
          const textResponse = await response.text();
          console.log("Update Profile Image Response Text:", textResponse);
          const data = JSON.parse(textResponse);
          console.log("Update Profile Image Response JSON:", data);
          if (response.ok && data.success) {
            setProfileImage(imageurl);
            alert("Profile updated successfully");
          } else {
            alert("Failed to update profile");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } else {
        alert("Failed to upload profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const updateProfileImage = async (imageUrl) => {
    const token = await AsyncStorage.getItem("jwtToken");
    console.log("Updating profile with image URL:", imageUrl);

    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/hospital/profileupdate", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      const textResponse = await response.text();
      console.log("Update Profile Image Response Text:", textResponse);

      const data = JSON.parse(textResponse);
      console.log("Update Profile Image Response JSON:", data);

      if (response.ok && data.success) {
        setProfileImage(imageUrl);
        alert("Profile updated successfully");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = () => {
    AsyncStorage.removeItem("jwtToken");
    AsyncStorage.removeItem("hospitalId");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 30,
        marginHorizontal: 20,
      }}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={{
              alignItems: "center",
              marginBottom: 20,
              display: "flex",
              marginTop: 40,
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <Image
              source={{ uri: profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <View
              style={{
                alignItems: "center",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold", marginRight: 10 }}>
                {hospitalName}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
            onPress={() => {
              navigation.navigate("Account Details", { data: hosp });
            }}
          >
            <Text style={{ fontSize: 18 }}>Account details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
            onPress={() => {
              navigation.navigate("Help and Support");
            }}
          >
            <Text style={{ fontSize: 18 }}>Help and Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              marginTop: 20,
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "red",
                textDecorationLine: "underline",
                marginBottom: 5,
                fontSize: 20,
                fontWeight: "semibold",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SettingsScreen;