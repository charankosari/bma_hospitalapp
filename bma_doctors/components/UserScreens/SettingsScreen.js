import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const SettingsScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [image, setImage] = useState(null);
  const [hosp, setHosp] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true); // Show loading indicator
      uploadImage(pickerResult);
    }
  };

  const uploadImage = async (pickerResult) => {
    const formData = new FormData();
    formData.append("file", {
      uri: pickerResult.assets[0].uri,
      name: pickerResult.assets[0].fileName,
      type: pickerResult.assets[0].mimeType,
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
      const data = JSON.parse(textResponse);

      if (response.ok) {
        const token = await AsyncStorage.getItem("jwtToken");
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
          const data = JSON.parse(textResponse);
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
    } finally {
      setUploading(false); 
    }
  };

  const handleSignOut = () => {
    AsyncStorage.removeItem("jwtToken");
    AsyncStorage.removeItem("hospitalId");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {(loading || uploading) && (
        <BlurView intensity={50} style={styles.blurView}>
          <ActivityIndicator size="large" color="#2BB673" />
          <Text style={styles.loadingText}>{uploading ? "Uploading..." : "Loading..."}</Text>
        </BlurView>
      )}
      {!loading && !uploading && (
        <View>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={styles.imageContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Upload Image</Text>
              </View>
            )}
            <Text style={styles.hospitalName}>{hospitalName}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              navigation.navigate("Account Details", { data: hosp });
            }}
          >
            <Text style={styles.optionText}>Account details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              navigation.navigate("Help and Support");
            }}
          >
            <Text style={styles.optionText}>Help and Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 30,
    marginHorizontal: 20,
  },
  blurView: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2BB673",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    display: "flex",
    marginTop: 40,
    flexDirection: "column",
    justifyContent: "center",
    gap: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#d7d7d7",
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  placeholderText: {
    fontSize: 16,
    color: "#777",
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
  },
  signOutButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "red",
    textDecorationLine: "underline",
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "semibold",
  },
});

export default SettingsScreen;
