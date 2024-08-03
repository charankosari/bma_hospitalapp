import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";

const DoctorPreviewPage = ({ navigation }) => {
  const route = useRoute();
  const { doctor } = route.params;

  const [name, setName] = useState(doctor.name);
  const [study, setStudy] = useState(doctor.study);
  const [specialist, setSpecialist] = useState(doctor.specialist);
  const [consultancyFee, setConsultancyFee] = useState(
    doctor.price.consultancyfee
  );
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [noOfDays, setNoOfDays] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [showMorningEndPicker, setShowMorningEndPicker] = useState(false);
  const [showEveningEndPicker, setShowEveningEndPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(doctor.image);
  const [manageSlots, setManageSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [morningStartTime, setMorningStartTime] = useState(
    "Select morning start time"
  );
  const [morningEndTime, setMorningEndTime] = useState(
    "Select morning end time"
  );
  const [eveningStartTime, setEveningStartTime] = useState(
    "Select evening start time"
  );
  const [eveningEndTime, setEveningEndTime] = useState(
    "Select evening end time"
  );
  const defaultStartmorning = "08:00";
  const defaultEndmorning = "12:00";
  const defaultStartEvening = "13:00";
  const defaultEndEvening = "19:00";
  useEffect(() => {
    const fetchJWT = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      setJwtToken(token);
      console.log(token)
    };
    fetchJWT();
  }, []);
  const convertTimeStringToDate = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

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
      setShowMorningEndPicker(false);
    } else if (type === "eveningStart") {
      setEveningStartTime(formattedTime);
      setShowEveningPicker(false);
    } else if (type === "eveningEnd") {
      setEveningEndTime(formattedTime);
      setShowEveningEndPicker(false);
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
  const onCloseManageSlots = () => {
    setMorningStartTime("Select morning start time");
    setEveningStartTime("Select evening start time");
    setMorningEndTime("Select morning end time");
    setEveningEndTime("Select evening end time");
    setStartDate(null);
    setNoOfDays(null);
    setManageSlots(false);
  };
  const handleImageUpload = async (result) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
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
      console.log(data);

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to upload image");
      }

      const payload = {
        docid: doctor.id,
        image: data.url,
      };

      await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/editdoctor",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      setImageUrl(data.url);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Image upload failed!");
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this doctor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `https://server.bookmyappointments.in/api/bma/hospital/deleteDoctor/${doctor.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                  },
                }
              );
              if (!response.ok) {
                throw new Error("Failed to delete doctor");
              }

              Alert.alert("Success", "Doctor deleted successfully");
              console.log("Doctor deleted successfully");
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete doctor");
            }
          },
        },
      ]
    );
  };
  const handleSaveSlots = async () => {
    const currentDate = moment();
    const selectedDate = moment(startDate); 
    setLoading(true);
    if (
      !startDate ||
      !noOfDays ||
      morningStartTime === "Select morning start time" ||
      morningEndTime === "Select morning end time" ||
      eveningStartTime === "Select evening start time" ||
      eveningEndTime === "Select evening end time"
    ) {
      alert("Please fill all the details.");
      setLoading(false); 
      return;
    }
    if (selectedDate.isBefore(currentDate)) {
      alert("Please select a date from today");
      setLoading(false); 
      return;
    }
    const formattedDate = moment(startDate).format("YYYY-MM-DD");
    const checkDate = moment(startDate).format("DD-MM-YYYY");
    if (doctor.bookingsids && doctor.bookingsids[checkDate]) {
      alert("Selected date already has existing slots.");
      setLoading(false); 
      return;
    }

    const payload = {
      doctorId: doctor.id,
      date: formattedDate,
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
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save slots");
      setLoading(false);
    }
  };

  const handleSaveDoctorDetails = async () => {
    setLoading(true);

    const payload = { docid: doctor.id };
    if (name !== doctor.name) payload.name = name;
    if (study !== doctor.study) payload.study = study;
    if (specialist !== doctor.specialist) payload.specialist = specialist;
    if (consultancyFee !== doctor.price.consultancyfee)
      payload.consultancyfee = consultancyFee;

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/editdoctor",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update doctor details");
      }
      alert("Doctor details updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update doctor details");
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/singledoc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorid: doctor._id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch doctor details");
      }

      const updatedDoctor = await response.json();
      setName(updatedDoctor.doctor.name);
      setStudy(updatedDoctor.doctor.study);
      setSpecialist(updatedDoctor.doctor.specialist);
      setConsultancyFee(updatedDoctor.doctor.price.consultancyfee);
      setImageUrl(updatedDoctor.doctor.image);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch doctor details");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#2BB673" />
            ) : (
              <Image source={{ uri: imageUrl }} style={styles.profileImage} />
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Consultancy Fee</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={consultancyFee.toString()}
              onChangeText={setConsultancyFee}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveDoctorDetails}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#3498db" }]}
            onPress={() => setManageSlots(true)}
          >
            <Text style={styles.buttonText}>Add Slots</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#e67e22" }]}
            onPress={() =>
              navigation.navigate("MyBookings", { doctorId: doctor.id })
            }
          >
            <Text style={styles.buttonText}>Show Bookings</Text>
          </TouchableOpacity>

          <Modal
            visible={manageSlots}
            transparent
            animationType="slide"
            onRequestClose={() => setManageSlots(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
               <TouchableOpacity
  onPress={() => onCloseManageSlots()}
  style={styles.closeButton}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{color:'red'}}>Close</Text>
    <Ionicons name="close-circle" size={24} color="red" style={{ marginLeft: 5 }} />
  </View>
</TouchableOpacity>

                <Text style={styles.modalTitle}>Add Slots</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Start Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>
                      {startDate ? startDate.toDateString() : "Select Date"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  textColor="#000"
                  onConfirm={handleDateChange}
                  onCancel={() => setShowDatePicker(false)}
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Number of Days:</Text>
                  <RNPickerSelect
                    onValueChange={(value) => setNoOfDays(value)}
                    items={[
                      { label: "1 day", value: 1 },
                      { label: "2 days", value: 2 },
                      { label: "3 days ", value: 3 },
                      { label: "4 days", value: 4 },
                      { label: "5 days", value: 5 },
                      { label: "6 days", value: 6 },
                      { label: "7 days", value: 7 },
                      { label: "8 days ", value: 8 },
                      { label: "9 days", value: 9 },
                      { label: "10 days", value: 10 },
                      { label: "11 days", value: 11 },
                      { label: "12 days", value: 12 },
                    ]}
                    placeholder={{
                      label: "Select Number of Days",
                      value: null,
                    }}
                    style={pickerSelectStyles}
                    value={noOfDays}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Morning Start Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowMorningPicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>{morningStartTime}</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={showMorningPicker}
                  mode="time"
                  date={convertTimeStringToDate(defaultStartmorning)}
                  textColor="#000"
                  onConfirm={(time) => handleTimeChange(time, "morningStart")}
                  onCancel={() => setShowMorningPicker(false)}
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Morning End Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowMorningEndPicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>{morningEndTime}</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={showMorningEndPicker}
                  mode="time"
                  textColor="#000"
                  date={convertTimeStringToDate(defaultEndmorning)}
                  onConfirm={(time) => handleTimeChange(time, "morningEnd")}
                  onCancel={() => setShowMorningEndPicker(false)}
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Evening Start Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowEveningPicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>{eveningStartTime}</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={showEveningPicker}
                  mode="time"
                  textColor="#000"
                  date={convertTimeStringToDate(defaultStartEvening)}
                  onConfirm={(time) => handleTimeChange(time, "eveningStart")}
                  onCancel={() => setShowEveningPicker(false)}
                />

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Evening End Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowEveningEndPicker(true)}
                    style={styles.dateInput}
                  >
                    <Text>{eveningEndTime}</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePickerModal
                  isVisible={showEveningEndPicker}
                  mode="time"
                  date={convertTimeStringToDate(defaultEndEvening)}
                  textColor="#000"
                  onConfirm={(time) => handleTimeChange(time, "eveningEnd")}
                  onCancel={() => setShowEveningEndPicker(false)}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSaveSlots}
                >
                  <Text style={styles.buttonText}>Save Slots</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "#2BB673",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: "20px",
    height: "20px",
    padding:'30px',
    zIndex:'999'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
});

export default DoctorPreviewPage;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
  },
  inputAndroid: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    textAlign: "center",
  },
});
