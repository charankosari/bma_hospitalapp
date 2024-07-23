import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Slider } from "galio-framework";
import * as ImagePicker from "expo-image-picker";

export default function AddDoctors() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [noOfDays, setNoOfDays] = useState(1);
  const [appointmentDuration, setAppointmentDuration] = useState(15);
  const [morningStartTime, setMorningStartTime] = useState("09:00");
  const [morningEndTime, setMorningEndTime] = useState("12:00");
  const [eveningStartTime, setEveningStartTime] = useState("15:00");
  const [eveningEndTime, setEveningEndTime] = useState("17:00");
  const [consultancyFee, setConsultancyFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  const [isMorningStartTimePickerVisible, setIsMorningStartTimePickerVisible] =
    useState(false);
  const [isMorningEndTimePickerVisible, setIsMorningEndTimePickerVisible] =
    useState(false);
  const [isEveningStartTimePickerVisible, setIsEveningStartTimePickerVisible] =
    useState(false);
  const [isEveningEndTimePickerVisible, setIsEveningEndTimePickerVisible] =
    useState(false);
    const convertTimeStringToDate = (timeString) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    };
  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setShowDatePicker(false);
  };
  const handleImageCancel = () => {
    setImageSelected(false); 
  };
  const showMorningStartTimePicker = () => {
    setIsMorningStartTimePickerVisible(true);
  };

  const showMorningEndTimePicker = () => {
    setIsMorningEndTimePickerVisible(true);
  };

  const showEveningStartTimePicker = () => {
    setIsEveningStartTimePickerVisible(true);
  };

  const showEveningEndTimePicker = () => {
    setIsEveningEndTimePickerVisible(true);
  };

  const hideMorningStartTimePicker = () => {
    setIsMorningStartTimePickerVisible(false);
  };

  const hideMorningEndTimePicker = () => {
    setIsMorningEndTimePickerVisible(false);
  };

  const hideEveningStartTimePicker = () => {
    setIsEveningStartTimePickerVisible(false);
  };

  const hideEveningEndTimePicker = () => {
    setIsEveningEndTimePickerVisible(false);
  };

  const handleMorningStartTimeConfirm = (time) => {
    setMorningStartTime(formatTime(time));
    hideMorningStartTimePicker();
  };

  const handleMorningEndTimeConfirm = (time) => {
    setMorningEndTime(formatTime(time));
    hideMorningEndTimePicker();
  };

  const handleEveningStartTimeConfirm = (time) => {
    setEveningStartTime(formatTime(time));
    hideEveningStartTimePicker();
  };

  const handleEveningEndTimeConfirm = (time) => {
    setEveningEndTime(formatTime(time));
    hideEveningEndTimePicker();
  };

  const formatTime = (time) => {
    return `${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const handleImagePicker = async () => {
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
      const fileSizeInMB = result.assets[0].fileSize / (1024 * 1024); 
      if (fileSizeInMB > 2) {
        Alert.alert("Error", "Image size should not exceed 2 MB. Please select a smaller image.");
        return;
      }
      setImage(result);
      setImageSelected(true);
    }
  };
  const handleAddDoctor = async () => {
    if (!name || !consultancyFee) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
  
    setLoading(true);
  
    try {
      let imageUrl = "";
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
  
        const responseText = await response.text();
  
        if (response.ok) {
          const data = JSON.parse(responseText);
          if (data.url) {
            imageUrl = data.url;
          } else {
            throw new Error("Failed to upload image: URL not found in response");
          }
        } else {
          throw new Error(`Failed to upload image: ${response.status} ${response.statusText}`);
        }
      }
  
      const testData = {
        name: name,
        image: imageUrl,
        price: {
          consultancyfee: parseInt(consultancyFee),
        },
        timings: {
          morning: [
            {
              startTime: morningStartTime,
              endTime: morningEndTime,
            },
          ],
          evening: [
            {
              startTime: eveningStartTime,
              endTime: eveningEndTime,
            },
          ],
        },
        slotTimings: appointmentDuration,
        noOfDays: parseInt(noOfDays),
      };
  
      const token = await AsyncStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Token not found");
      }
  
      const addDoctorResponse = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/addtest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        }
      );
  
      const addDoctorResponseText = await addDoctorResponse.text();
  
      if (addDoctorResponse.ok) {
        const responseData = JSON.parse(addDoctorResponseText);
  
        setLoading(false);
        Alert.alert("Success", "Test added successfully!");
  
        // Reset form fields
        setImage(null);
        setName("");
        setStartDate(new Date());
        setNoOfDays(1);
        setAppointmentDuration(15);
        setMorningStartTime("09:00");
        setMorningEndTime("12:00");
        setEveningStartTime("15:00");
        setEveningEndTime("17:00");
        setConsultancyFee("");
      } else {
        throw new Error(`Failed to add test: ${addDoctorResponse.status} ${addDoctorResponse.statusText}`);
      }
    } catch (error) {
      console.error("Error adding test:", error);
      Alert.alert("Error", `Failed to add test. Please try again later.\n${error.message}`);
      setLoading(false);
    }
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Add Test</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Test Photo</Text>
          {!imageSelected && (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={handleImagePicker}
            >
              <Text style={styles.imageUploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
          {imageSelected && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imageSelectedText}>Image Selected</Text>
              <TouchableOpacity
                style={styles.imageCancel}
                onPress={handleImageCancel}
              >
                <Text style={styles.imageCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Test Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter test's name"
          />
        </View>

       
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
          <Text style={styles.label}>Number of Days Available</Text>
          <Slider
            value={noOfDays}
            minimumValue={1}
            maximumValue={7}
            activeColor="#2BB673"
            thumbStyle={{borderColor:'#2BB673'}}
            step={1}
            onValueChange={(value) => setNoOfDays(value)}
            style={styles.slider}
          />
          <Text style={styles.sliderValue}>{noOfDays} days</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Appointment Duration (minutes)</Text>
          <Slider
            value={appointmentDuration}
            minimumValue={15}
            maximumValue={60}
            activeColor="#2BB673"
            thumbStyle={{borderColor:'#2BB673'}}
            step={5}
            onValueChange={(value) => setAppointmentDuration(value)}
            style={styles.slider}
          />
          <Text style={styles.sliderValue}>{appointmentDuration} mins</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Consultancy Fee </Text>
          <TextInput
            style={styles.input}
            value={consultancyFee}
            onChangeText={setConsultancyFee}
            keyboardType="numeric"
            placeholder="Enter consultancy fee"
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Morning Timings</Text>
          <View style={styles.timePickerContainer}>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={showMorningStartTimePicker}
            >
              <Text style={styles.timePickerText}>{morningStartTime}</Text>
            </TouchableOpacity>
            <Text style={styles.timePickerSeparator}>to</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={showMorningEndTimePicker}
            >
              <Text style={styles.timePickerText}>{morningEndTime}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isMorningStartTimePickerVisible}
            date={convertTimeStringToDate(morningStartTime)}
            mode="time"
            textColor="#000"
            onConfirm={handleMorningStartTimeConfirm}
            onCancel={hideMorningStartTimePicker}
          />
          <DateTimePickerModal
            isVisible={isMorningEndTimePickerVisible}
            mode="time"
            textColor="#000"
            date={convertTimeStringToDate(morningEndTime)}
            onConfirm={handleMorningEndTimeConfirm}
            onCancel={hideMorningEndTimePicker}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Evening Timings</Text>
          <View style={styles.timePickerContainer}>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={showEveningStartTimePicker}
            >
              <Text style={styles.timePickerText}>{eveningStartTime}</Text>
            </TouchableOpacity>
            <Text style={styles.timePickerSeparator}>to</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={showEveningEndTimePicker}
            >
              <Text style={styles.timePickerText}>{eveningEndTime}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isEveningStartTimePickerVisible}
            mode="time"
            textColor="black"
            date={convertTimeStringToDate(eveningStartTime)}
            onConfirm={handleEveningStartTimeConfirm}
            onCancel={hideEveningStartTimePicker}
          />
          <DateTimePickerModal
            isVisible={isEveningEndTimePickerVisible}
            date={convertTimeStringToDate(eveningEndTime)}
            mode="time"
            textColor="black"
            onConfirm={handleEveningEndTimeConfirm}
            onCancel={hideEveningEndTimePicker}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddDoctor}
          disabled={loading} 
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.addButtonLabel}>Add Test</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  multiSelectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  multiSelectItemText: {
    fontSize: 16,
  },
  multiSelectSelectedItemText: {
    fontSize: 16,
    color: "#2BB673",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  imageUploadButton: {
    backgroundColor: "#2BB673",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  imageUploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  imageCancel: {
    backgroundColor: "#FF0000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imageCancelText: {
    color: "#fff",
    fontSize: 14,
  },
  imageSelectedText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  datePickerText: {
    fontSize: 16,
  },
  slider: {
    width: "100%",
    marginTop: 10,
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  timePickerText: {
    fontSize: 16,
  },
  timePickerSeparator: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#2BB673",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  qualificationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  qualificationsButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  qualificationsButtonSelected: {
    backgroundColor: "#2BB673",
    borderColor: "#2BB673",
  },
  qualificationsButtonText: {
    fontSize: 16,
  },
  qualificationsButtonTextSelected: {
    color: "#fff",
  },
});
