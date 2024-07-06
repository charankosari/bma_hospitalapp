import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { Slider } from "galio-framework";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const DoctorPreviewPage = () => {
  const route = useRoute();
  const { doctor } = route.params;

  const [name, setName] = useState(doctor.name);
  const [study, setStudy] = useState(doctor.study);
  const [specialist, setSpecialist] = useState(doctor.specialist);
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [noOfDays, setNoOfDays] = useState(1);
  const [morningStartTime, setMorningStartTime] = useState("08:00");
  const [morningEndTime, setMorningEndTime] = useState("12:00");
  const [eveningStartTime, setEveningStartTime] = useState("14:00");
  const [eveningEndTime, setEveningEndTime] = useState("19:00");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(doctor.image);
  const [manageSlots, setManageSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDateChange = (date) => {
    setStartDate(date);
    setShowDatePicker(false);
  };
  const handleTimeChange = (time, type) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (type === "morningStart") {
      setMorningStartTime(formattedTime);
      setShowMorningPicker(false);
    } else if (type === "morningEnd") {
      setMorningEndTime(formattedTime);
      setShowMorningPicker(false);
    } else if (type === "eveningStart") {
      setEveningStartTime(formattedTime);
      setShowEveningPicker(false);
    } else if (type === "eveningEnd") {
      setEveningEndTime(formattedTime);
      setShowEveningPicker(false);
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
      handleImageUpload(result);
    }
  };
  const handleImageUpload = async (image) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: image.uri.split("/").pop(),
      type: "image/jpeg",
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
      const data = await response.json();
      console.log("Image upload response:", data);

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to upload image");
      }

      setImageUrl(data.url);
      setLoading(false);
      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error(error);
      alert("Image upload failed!");
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this doctor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => alert("Doctor deleted"),
        },
      ]
    );
  };

  const handleSaveSlots = async () => {
    const payload = {
      doctorId: doctor.id,
      date: startDate.toISOString().split("T")[0],
      noOfDays,
      slotTimings: 30,
      morning: {
        startTime: morningStartTime,
        endTime: morningEndTime,
      },
      evening: {
        startTime: eveningStartTime,
        endTime: eveningEndTime,
      },
    };

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/me/addmoresessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save slots");
      }
      alert("Slots saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save slots");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Image
              source={image ? { uri: image.uri } : { uri: imageUrl }}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Study</Text>
          <TextInput
            style={styles.input}
            value={study}
            onChangeText={setStudy}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Specialist</Text>
          <TextInput
            style={styles.input}
            value={specialist}
            onChangeText={setSpecialist}
          />
        </View>

        <Button
          title="Manage Slots"
          onPress={() => setManageSlots(!manageSlots)}
        />
        {manageSlots && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                textColor="#000"
                onConfirm={handleDateChange}
                onCancel={() => setShowDatePicker(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Number of Days</Text>
              <Slider
                value={noOfDays}
                minimumValue={1}
                maximumValue={7}
                step={1}
                onValueChange={setNoOfDays}
                style={styles.slider}
              />
              <Text>{noOfDays}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Morning Start Time</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowMorningPicker(true)}
              >
                <Text style={styles.datePickerText}>{morningStartTime}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showMorningPicker}
                mode="time"
                textColor="#000"
                onConfirm={(time) => handleTimeChange(time, "morningStart")}
                onCancel={() => setShowMorningPicker(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Morning End Time</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowMorningPicker(true)}
              >
                <Text style={styles.datePickerText}>{morningEndTime}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showMorningPicker}
                mode="time"
                textColor="#000"
                onConfirm={(time) => handleTimeChange(time, "morningEnd")}
                onCancel={() => setShowMorningPicker(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Evening Start Time</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEveningPicker(true)}
              >
                <Text style={styles.datePickerText}>{eveningStartTime}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showEveningPicker}
                mode="time"
                textColor="#000"
                onConfirm={(time) => handleTimeChange(time, "eveningStart")}
                onCancel={() => setShowEveningPicker(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Evening End Time</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEveningPicker(true)}
              >
                <Text style={styles.datePickerText}>{eveningEndTime}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showEveningPicker}
                mode="time"
                textColor="#000"
                onConfirm={(time) => handleTimeChange(time, "eveningEnd")}
                onCancel={() => setShowEveningPicker(false)}
              />
            </View>
            <TouchableOpacity onPress={handleSaveSlots}>
              <Text>Save Slots</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("MyBookings", { doctor })}
        >
          <Text>Show Bookings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    color: "#000",
  },
  slider: {
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
  },
});

export default DoctorPreviewPage;
