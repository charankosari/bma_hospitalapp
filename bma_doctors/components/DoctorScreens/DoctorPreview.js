import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from "react-native";
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
          <TouchableOpacity style={{position:'absolute',top:0,right:5,padding:15,display:'flex',alignItems:'center'}}>
          <Ionicons name="create-outline" size={24} color="#black" /> 
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
    backgroundColor: "#007BFF", // Blue color
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
