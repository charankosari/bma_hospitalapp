import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function App({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");
  const [hospid, setHospid] = useState('');

  useEffect(() => {
    async function fetchRoleAndData() {
      try {
        const userRole = await AsyncStorage.getItem("role");
        const hospitalId = await AsyncStorage.getItem("hospitalId");
        setHospid(hospitalId);
        setRole(userRole);
        if (userRole && hospitalId) {
          fetchData(userRole, hospitalId);
        } else {
          throw new Error("Role or Hospital ID is missing");
        }
      } catch (error) {
        console.error("Failed to fetch role and hospital ID:", error);
        setError("Failed to fetch role and hospital ID.");
        setLoading(false);
      }
    }
    fetchRoleAndData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (role && hospid) {
        fetchData(role, hospid);
      }
    }, [role, hospid])
  );

  const fetchData = async (userRole, hospitalId) => {
    try {
      setLoading(true);
      let url = userRole === "lab" ?
        `https://server.bookmyappointments.in/api/bma/user/labs/${hospitalId}` :
        `https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        if (userRole === "lab") {
          setAllDoctors(data.hospital.tests);
          setFilteredDoctors(data.hospital.tests);
        } else {
          setAllDoctors(data.hospital.doctors);
          setFilteredDoctors(data.hospital.doctors);
        }
        setError(null);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredDoctors(allDoctors);
    } else {
      const filtered = allDoctors.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";
        const specialist = item.specialist ? item.specialist.toLowerCase() : "";
        const study = item.study ? item.study.toLowerCase() : "";
        return (
          name.includes(text.toLowerCase()) ||
          specialist.includes(text.toLowerCase()) ||
          study.includes(text.toLowerCase())
        );
      });
      setFilteredDoctors(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(role === "lab" ? "Test preview" : "Doctor Preview", { doctor:item });
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
         source={{ uri: Array.isArray(item.image) ? item.image[0] : item.image }}
          style={{ width: 90, height: 90, borderRadius: 10, marginRight: 10 }}
        />
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            {item.name}
          </Text>
          {role !== "lab" && (
            <>
              <Text style={{ fontSize: 16, color: "gray" }}>
                {item.specialist}
              </Text>
              <Text style={{ fontSize: 16, color: "gray" }}>{item.study}</Text>
            </>
          )}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, paddingHorizontal: 10, marginVertical: 15 }}>
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

        {filteredDoctors.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>No {role === "lab" ? "tests" : "doctors"} found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
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
            navigation.navigate(role === "lab" ? "Add test" : "Add doctor");
          }}
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
