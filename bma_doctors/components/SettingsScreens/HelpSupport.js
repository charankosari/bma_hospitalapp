import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

const HelpAndSupport = () => {
  const faqs = [
    {
      question: "How do I access doctors appointment details?",
      answer:
        `To view a doctor's bookings, select the doctor on the Home Screen, then tap View Bookings to see detailed appointment information, including date, time, and patient details.`,
    },
    {
      question: " What happens if there are technical issues with the booking app?",
      answer:
        "In case of any technical issues with the app, please contact our IT support team immediately through the Help Desk section. Our team is available 24/7 to assist with resolving any app-related issues promptly.",
    },
  ];
  const phoneNumber = '+9178326238';
  const emailAddress = 'support@example.com';

  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (index) => {
    setActiveSections((prevSections) =>
      prevSections.includes(index)
        ? prevSections.filter((section) => section !== index)
        : [...prevSections, index]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Help and Support</Text>

        <View style={styles.card}>
          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
        
            <Text style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Frequently Asked Questions
              </Text>
            </Text>
          </View>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                onPress={() => toggleSection(index)}
                style={styles.faqQuestion}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons
                  name={
                    activeSections.includes(index)
                      ? "caret-up-outline"
                      : "caret-down-outline"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <Collapsible collapsed={!activeSections.includes(index)}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </Collapsible>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
       
            <Text style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Contact Us</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <FontAwesome name="phone" size={16} color="#2BB673" />
            <Text style={styles.contactText}>Call Us :{phoneNumber}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <FontAwesome name="envelope" size={16} color="#2BB673" />
            <Text style={styles.contactText}>Email: {emailAddress}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
      
            <Text style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Customer Support</Text>
            </Text>
          </View>

          <Text style={styles.supportText}>
            For any issues or inquiries, our customer support team is available
            24/7 to assist you. You can reach out to us via phone, email, or
            through our live chat feature on the website.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop:Platform.OS==='ios'?0:30
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2BB673",
    marginLeft: 10,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding:5
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    marginLeft: 10,
    padding:5
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding:5
  },
  contactText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  supportText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
});

export default HelpAndSupport;
