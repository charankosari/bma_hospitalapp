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
import RNPickerSelect from "react-native-picker-select";

import { Slider } from "galio-framework";
import * as ImagePicker from "expo-image-picker";

export default function AddDoctors() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [noOfDays, setNoOfDays] = useState(1);
  const [appointmentDuration, setAppointmentDuration] = useState(15);
  const [morningStartTime, setMorningStartTime] = useState("09:00");
  const [morningEndTime, setMorningEndTime] = useState("12:00");
  const [eveningStartTime, setEveningStartTime] = useState("15:00");
  const [eveningEndTime, setEveningEndTime] = useState("17:00");
  const [consultancyFee, setConsultancyFee] = useState("");
  const [experience, setExperience] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [loading,setLoading]=useState(false);
  const [imageSelected, setImageSelected] = useState(false); 
  const [imageUrl,setImageUrl]=useState('');

  const [isMorningStartTimePickerVisible, setIsMorningStartTimePickerVisible] =
    useState(false);
  const [isMorningEndTimePickerVisible, setIsMorningEndTimePickerVisible] =
    useState(false);
  const [isEveningStartTimePickerVisible, setIsEveningStartTimePickerVisible] =
    useState(false);
  const [isEveningEndTimePickerVisible, setIsEveningEndTimePickerVisible] =
    useState(false);

  const specialityOptions = [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Dermatology", value: "Dermatology" },
    { label: "Neurology", value: "Neurology" },
  ];
  const qualificationsOptions = [
    { label: "MBBS", value: "MBBS" },
    { label: "MD", value: "MD" },
    { label: "PhD", value: "PhD" },
  ];

  const toggleQualification = (qualification) => {
    if (qualifications.includes(qualification)) {
      setQualifications(qualifications.filter((q) => q !== qualification));
    } else {
      setQualifications([...qualifications, qualification]);
    }
  };

  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setShowDatePicker(false);
  };
  const handleImageCancel = () => {
    setImageSelected(false); // Reset image selection flag
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
      setImage(result);
      setImageSelected(true); // Set image selected flag to true
    }
  };
  const handleAddDoctor = async () => {
    if (
      !name ||
      !speciality ||
      qualifications.length === 0 ||
      !consultancyFee ||
      !experience ||
      !serviceFee
    ) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }
  setLoading(true)
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
  
        const data = await response.json();
        console.log("Image upload response:", data);
  
        if (response.ok && data.url) {
          imageUrl = data.url; // Assuming 'url' is the field containing the uploaded image URL
        } else {
          throw new Error("Failed to upload image");
        }
      }
      const formattedQualifications = qualifications.map((item) => item).join(", ");
      const doctorData = {
        name: name,
        experience: parseInt(experience),
        study: formattedQualifications,
        specialist: speciality,
        image: imageUrl,
        price: {
          consultancyfee: parseInt(consultancyFee),
          servicefee: parseInt(serviceFee),
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
      const addDoctorResponse = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/adddoctor",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doctorData),
        }
      );
  
      const responseData = await addDoctorResponse.json();
      console.log("Add doctor response:", responseData);
  
      if (addDoctorResponse.ok) {
        setLoading(false)
        Alert.alert("Success", "Doctor added successfully!");
        // Reset form fields
        setImage(null);
        setName("");
        setSpeciality("");
        setStartDate(new Date());
        setNoOfDays(1);
        setAppointmentDuration(15);
        setMorningStartTime("09:00");
        setMorningEndTime("12:00");
        setEveningStartTime("15:00");
        setEveningEndTime("17:00");
        setConsultancyFee("");
        setExperience("");
        setServiceFee("");
        setQualifications([]);
      } else {
        throw new Error("Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      Alert.alert("Error", "Failed to add doctor. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Add Doctor</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Doctor Photo</Text>
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
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter doctor's name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Speciality</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setSpeciality(value)}
            items={specialityOptions}
            placeholder={{
              label: "Select speciality",
              value: null,
            }}
            value={speciality}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Qualifications</Text>
          <ScrollView horizontal style={styles.qualificationsContainer}>
            {qualificationsOptions.map((qual) => (
              <TouchableOpacity
                key={qual.value}
                style={[
                  styles.qualificationsButton,
                  qualifications.includes(qual.value)
                    ? styles.qualificationsButtonSelected
                    : null,
                ]}
                onPress={() => toggleQualification(qual.value)}
              >
                <Text
                  style={[
                    styles.qualificationsButtonText,
                    qualifications.includes(qual.value)
                      ? styles.qualificationsButtonTextSelected
                      : null,
                  ]}
                >
                  {qual.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
            step={5}
            onValueChange={(value) => setAppointmentDuration(value)}
            style={styles.slider}
          />
          <Text style={styles.sliderValue}>{appointmentDuration} mins</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience (years)</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            placeholder="Enter years of experience"
          />
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
          <Text style={styles.label}>Service Fee </Text>
          <TextInput
            style={styles.input}
            value={serviceFee}
            onChangeText={setServiceFee}
            keyboardType="numeric"
            placeholder="Enter service fee"
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
            mode="time"
            onConfirm={handleMorningStartTimeConfirm}
            onCancel={hideMorningStartTimePicker}
          />
          <DateTimePickerModal
            isVisible={isMorningEndTimePickerVisible}
            mode="time"
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
            onConfirm={handleEveningStartTimeConfirm}
            onCancel={hideEveningStartTimePicker}
          />
          <DateTimePickerModal
            isVisible={isEveningEndTimePickerVisible}
            mode="time"
            onConfirm={handleEveningEndTimeConfirm}
            onCancel={hideEveningEndTimePicker}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddDoctor}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.addButtonLabel}>Add Doctor</Text>
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
    color: "#2BB673", // Selected item text color
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#333",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
