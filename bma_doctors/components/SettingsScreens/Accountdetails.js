import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountDetails = ({ route }) => {
  const { data } = route.params;

  const [name, setName] = useState(data.hosp.hospitalName || "");
  const [email, setEmail] = useState(data.hosp.email || "");
  const [mobileNumber, setMobileNumber] = useState(data.hosp.number.toString() || "");
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [addressHospitalAddress, setAddressHospitalAddress] = useState(data.hosp.address[0].hospitalAddress);
  const [addressCity, setAddressCity] = useState(data.hosp.address[0].city);
  const [addressPincode, setAddressPincode] = useState(String(data.hosp.address[0].pincode));


  const handleChangeNumber = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewMobileNumber("");
    setOtp("");
    setStep(1);
  };

  const handleSendOtp = async () => {
    try {
      setIsLoadingSendOtp(true);
      const token = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/verifynumber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ number: parseInt(newMobileNumber, 10) }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent successfully!");
        setStep(2);
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoadingVerifyOtp(true);
      const token = await AsyncStorage.getItem("jwtToken");
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/hospital/numberupdate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hospid: data.hosp._id,
            number: newMobileNumber,
            otp: parseInt(otp, 10),
          }),
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        alert("Mobile number updated successfully!");
        setMobileNumber(newMobileNumber);
        handleCloseModal();
      } else {
        alert("Failed to verify OTP or update mobile number");
      }
    } catch (error) {
      console.error("Error verifying OTP and updating mobile number:", error);
    } finally {
      setIsLoadingVerifyOtp(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
    

      const token = await AsyncStorage.getItem("jwtToken");
      const updatedFields = {};

      if (name !== data.hosp.hospitalName) {
        updatedFields.hospitalName = name;
      }

      if (email !== data.hosp.email) {
        updatedFields.email = email;
      }

      if (addressHospitalAddress !== data.hosp.address[0]?.hospitalAddress) {
        updatedFields.address = {
          ...(updatedFields.address || {}),
          hospitalAddress: addressHospitalAddress,
        };
      }

      if (addressCity !== data.hosp.address[0]?.city) {
        updatedFields.address = {
          ...(updatedFields.address || {}),
          city: addressCity,
        };
      }

      if (addressPincode !== data.hosp.address[0]?.pincode) {
        updatedFields.address = {
          ...(updatedFields.address || {}),
          pincode: Number(addressPincode),
        };
      }

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes to update.");
        return;
      }

      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/me/profileupdate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile:", result);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hospital Name</Text>
          <TextInput
            placeholder="Enter hospital name"
            value={name}
            editable={!loading}
            style={styles.input}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter email"
            value={email}
            editable={!loading}
            style={styles.input}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>

          <TextInput
            placeholder="Enter hospital address"
            value={addressHospitalAddress}
            style={styles.input}
            onChangeText={setAddressHospitalAddress}
          />

          <TextInput
            placeholder="Enter city"
            value={addressCity}
            style={styles.input}
            onChangeText={setAddressCity}
          />

          <TextInput
            value={addressPincode}
            style={styles.input}
            onChangeText={setAddressPincode}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.mobileNumberContainer}>
            <TextInput
              placeholder="Enter mobile number"
              value={mobileNumber}
              editable={false}
              style={[styles.input, styles.mobileNumberInput]}
            />
            <TouchableOpacity onPress={handleChangeNumber}>
              <Text style={styles.changeNumberText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.updateButtonContainer}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButton}>Update</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {step === 1 ? (
                <>
                  <Text style={styles.modalTitle}>Change Mobile Number</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter new mobile number"
                    placeholderTextColor={"#7d7d7d"}
                    value={newMobileNumber}
                    keyboardType="number-pad"
                    onChangeText={setNewMobileNumber}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleSendOtp}
                    disabled={isLoadingSendOtp}
                  >
                    {isLoadingSendOtp ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.modalButtonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Verify OTP</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter OTP"
                    placeholderTextColor={"#7d7d7d"}
                    value={otp}
                    keyboardType="number-pad"
                    onChangeText={setOtp}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleVerifyOtp}
                    disabled={isLoadingVerifyOtp}
                  >
                    {isLoadingVerifyOtp ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.modalButtonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={styles.modalCloseButtonn}
                onPress={handleCloseModal}
              >
                <Text style={styles.modalCloseButtonnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    color: "#2BB673",
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  mobileNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mobileNumberInput: {
    flex: 1,
  },
  changeNumberText: {
    color: "#2BB673",
    fontSize: 16,
    marginLeft: 10,
  },
  updateButtonContainer: {
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#2BB673",
    color: "white",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 5,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    color: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#2BB673",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalCloseButtonn: {
    backgroundColor: "#6C757D",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  modalCloseButtonnText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AccountDetails;