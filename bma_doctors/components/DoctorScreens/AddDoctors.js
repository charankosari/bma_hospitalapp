import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CustomDropdown from "../CustomDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Slider } from "galio-framework";
import * as ImagePicker from "expo-image-picker";
export default function AddDoctors() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("set speciality");
  const [qualification, setQualification] = useState("set qualification");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [noOfDays, setNoOfDays] = useState(1);
  const [appointmentDuration, setAppointmentDuration] = useState(15);

  const specialityOptions = ["Cardiology", "Dermatology", "Neurology"];
  const qualificationOptions = ["MBBS", "MD", "PhD"];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const handleAddDoctor = () => {
    // Implement your logic to add a doctor here
  };
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access the media library is required!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Add Doctor</Text>

        <View style={{ ...styles.inputContainer, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Doctor Photo</Text>
          {!image && (
            <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
              <Text style={styles.imageUploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
          )}
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>

        <View style={{...styles.inputContainer,display:'flex',flexDirection:'row',gap:10,alignItems:'center'}}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter doctor's name"
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.label}>Speciality</Text>
          <CustomDropdown
            options={specialityOptions}
            selectedValue={speciality}
            onValueChange={setSpeciality}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.label}>Qualification</Text>
          <CustomDropdown
            options={qualificationOptions}
            selectedValue={qualification}
            onValueChange={setQualification}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
          />
        </View>

        <View style={styles.slotContainer}>
          <Text style={styles.slotTitle}>Slot Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePicker}
            >
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>No. of Days</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={noOfDays}
              activeColor="#2BB673"
              thumbStyle={{ backgroundColor: '#fff',borderColor:'#2BB673' }}
              onValueChange={(value) => setNoOfDays(Math.round(value))}
            />
            <Text>{noOfDays} days</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Appointment Duration (minutes)</Text>
            <Slider
              style={styles.slider}
              minimumValue={10}
              activeColor="#2BB673"
              thumbStyle={{ backgroundColor: '#fff',borderColor:'#2BB673' }}
              maximumValue={60}
              step={5}
              value={appointmentDuration}
              onValueChange={(value) =>
                setAppointmentDuration(Math.round(value))
              }
            />
            <Text>{appointmentDuration} min</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
          <Text style={styles.addButtonText}>Add Doctor</Text>
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
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  imageUploadButton: {
    backgroundColor: "#2BB673",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    width:'50%',
    marginLeft:10
  },
  imageUploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    height: 100,
  },

  slotContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  slotTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  datePicker: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#2BB673",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginLeft:10
  },

});
