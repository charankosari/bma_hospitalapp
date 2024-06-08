import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView,TextInput, TouchableOpacity,FlatList, Modal } from "react-native";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function DoctorPreview() {
  const route = useRoute();
  const { doctor } = route.params;

  const handleDeleteDoctor = () => {
    // Implement your logic to delete the doctor here
  };

  const handleManageSlots = () => {
    // Implement your logic to manage slots here
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name,
    experience: doctor.experience,
    study: doctor.study,
    specialist: doctor.specialist,
    code: doctor.code,
    slotTimings: doctor.slotTimings,
  });

  const handleEditDoctor = () => {
    // Implement your logic to edit the doctor here
    setModalVisible(true);
  };
  const DoneButton = () => {
    // Implement your logic to edit the doctor here
    console.log(formData);
    setModalVisible(false);
  };


  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const fields = [
    { label: "Name", name: "name" },
    { label: "Experience", name: "experience" },
    { label: "Study", name: "study" },
    { label: "Specialist", name: "specialist" },
    { label: "Code", name: "code" },
    { label: "Slot Timings", name: "slotTimings" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: doctor.image }}
            style={styles.image}
          />
        </View>
        <View style={styles.cardContainer}>
        
          <View style={styles.card}>
          <TouchableOpacity 
      style={{position: 'absolute', top: 0, right: 5, padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      onPress={handleEditDoctor}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="create-outline" size={28} color="black" />
        <Text style={{ marginLeft: 5 }}>Edit</Text>
      </View>
    </TouchableOpacity>
            <Text style={[styles.cardText, styles.boldText]}>Name: <Text style={styles.normalText}>{doctor.name}</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>Experience: <Text style={styles.normalText}>{doctor.experience} years</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>Study: <Text style={styles.normalText}>{doctor.study}</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>Specialist: <Text style={styles.normalText}>{doctor.specialist}</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>Code: <Text style={styles.normalText}>{doctor.code}</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>Slot Timings: <Text style={styles.normalText}>{doctor.slotTimings} min</Text></Text>
            <Text style={[styles.cardText, styles.boldText]}>No of Days: <Text style={styles.normalText}>{doctor.noOfDays}</Text></Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteDoctor}>
            <Text style={styles.buttonText}>Delete Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.manageButton]} onPress={handleManageSlots}>
            <Text style={styles.buttonText}>Manage Slots</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Doctor Details</Text>
            <Text>Enter one or many to edit</Text>
          <Text style={{position:'absolute',top:0,right:0,padding:20,color:'red'}} onPress={()=>{setModalVisible(false)}}>Exit</Text>
            <FlatList
              data={fields}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.inputContainer}>
                  <Text>{item.label}:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={item.label}
                    value={formData[item.name]}
                    onChangeText={(text) => handleInputChange(item.name, text)}
                  />
                </View>
              )}
            />
            <TouchableOpacity style={[styles.button, styles.modalButton]} onPress={DoneButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    height:0,
    marginTop:10
    // marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  normalText: {
    fontWeight: "normal",
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red", // Red color
  },
  manageButton: {
    backgroundColor: "#2BB673", // Blue color
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  }, modalButton: {
    backgroundColor: "#2BB673",
    marginTop: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
});
