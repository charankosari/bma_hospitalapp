import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

export default function App({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const hospitalId = await AsyncStorage.getItem("hospitalId");
      const url = `https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAllDoctors(data.hospital.doctors);
        setFilteredDoctors(data.hospital.doctors); // Initially set all doctors
        setError(null); // Clear any previous errors
      } else {
        setError(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Refetch data when screen gains focus
    }, [])
  );
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredDoctors(allDoctors); // Reset to all doctors if search query is empty
    } else {
      const filtered = allDoctors.filter((doctor) => {
        const name = doctor.name ? doctor.name.toLowerCase() : "";
        const study = doctor.study ? doctor.study.toLowerCase() : "";
        const code = doctor.code ? doctor.code.toLowerCase() : "";
        const specialist = doctor.specialist ? doctor.specialist.toLowerCase() : "";
  
        return (
          name.includes(text.toLowerCase()) ||
          study.includes(text.toLowerCase()) ||
          code.includes(text.toLowerCase()) ||
          specialist.includes(text.toLowerCase())
        );
      });
      setFilteredDoctors(filtered);
    }
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
          <Text style={{ fontSize: 16, color: "gray" }}>{doctor.study}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2BB673" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An error occurred: {error}</Text>
      </View>
    );
  }
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
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <TextInput
            style={{ flex: 1, paddingVertical: 10 }}
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchQuery}
          />
          <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
            <AntDesign
              style={{ marginRight: 10 }}
              name="search1"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {filteredDoctors.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>No doctors found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <DoctorContainer doctor={item} />}
        />
      )}

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
          navigation.navigate("Add doctor");
        }}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}