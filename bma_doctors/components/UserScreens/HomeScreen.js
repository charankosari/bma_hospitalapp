import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function App({ navigation }) {
  const doctors = [
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",
      name: "Dr. Charan Kosari",
      experience: 10,
      study: "MBBS, MD",
      specialist: "Cardiology",
      code: "CIADIR",
      slotTimings: 30,
      noOfDays: 7,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. John Doe",
      experience: 15,
      study: "MBBS, PhD",
      specialist: "Neurology",
      code: "NEURODOC",
      slotTimings: 45,
      noOfDays: 5,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Jane Smith",
      experience: 8,
      study: "MBBS, MS",
      specialist: "Orthopedics",
      code: "ORTHOEXP",
      slotTimings: 30,
      noOfDays: 7,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Michael Brown",
      experience: 12,
      study: "MBBS, MCh",
      specialist: "General Surgery",
      code: "GENSURG",
      slotTimings: 40,
      noOfDays: 6,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Emily Rodriguez",
      experience: 6,
      study: "MBBS, DNB",
      specialist: "Pediatrics",
      code: "PEDIDOC",
      slotTimings: 30,
      noOfDays: 7,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Alexander Lee",
      experience: 20,
      study: "MBBS, MS",
      specialist: "Oncology",
      code: "ONCODR",
      slotTimings: 45,
      noOfDays: 5,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Olivia Garcia",
      experience: 18,
      study: "MBBS, MD",
      specialist: "Dermatology",
      code: "DERMDOC",
      slotTimings: 35,
      noOfDays: 6,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Benjamin Martinez",
      experience: 9,
      study: "MBBS, MS",
      specialist: "Urology",
      code: "URODR",
      slotTimings: 30,
      noOfDays: 7,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. Sophia Clark",
      experience: 14,
      study: "MBBS, MD",
      specialist: "Endocrinology",
      code: "ENDODOC",
      slotTimings: 40,
      noOfDays: 6,
    },
    {
      image:
        "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg?w=740&t=st=1717738859~exp=1717739459~hmac=d3b4d848c141787aeb233b76ae88543af1f94b3e405cc433f684f4d9aa7bc944",

      name: "Dr. William Turner",
      experience: 7,
      study: "MBBS, MD",
      specialist: "Gastroenterology",
      code: "GASTRODR",
      slotTimings: 30,
      noOfDays: 7,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(text.toLowerCase()) ||
          doctor.study.toLowerCase().includes(text.toLowerCase()) ||
          doctor.specialist.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const handleSearchSubmit = () => {
    console.log("Search Query:", searchQuery);
  };

  const DoctorContainer = ({ doctor }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Doctor Preview", { doctor });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: 10,
          marginHorizontal: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: doctor.image }}
          style={{ width: 90, height: 90, borderRadius: 10, marginRight: 10 }}
        />
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {doctor.name}
          </Text>
          <Text style={{ fontSize: 16, color: "gray" }}>
            {doctor.specialist}
          </Text>
        
          <Text style={{ fontSize: 16, color: "gray" }}>{doctor.areaName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        marginVertical: 5,
        backgroundColor: "#fff",
      }}
    >
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              paddingHorizontal: 10,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{ flex: 1, paddingVertical: 10 }}
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
            />
            <TouchableOpacity onPress={handleSearchSubmit}>
              <AntDesign
                style={{ marginRight: 10 }}
                name="search1"
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <DoctorContainer key={item.doctorName} doctor={item} />
        )}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#2BB673",
          borderRadius: 50,
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("Add doctor")
        }}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
