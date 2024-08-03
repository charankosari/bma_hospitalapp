import React from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const PrivacyPolicy = () => {
  const openWebsite = () => {
    Linking.openURL('https://www.bookmyappointments.in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.intro}>
          We, Book My Appointment, along with our affiliates, operate the website 
          <TouchableOpacity onPress={openWebsite}>
            <Text style={styles.link}> www.bookmyappointments.in</Text>
          </TouchableOpacity>
          {' '}and the Book My Appointment software, services, and applications, including the mobile app 
          'Book My Appointment' and 'Book My Appointment Diagnostics'. Our priority is to protect the information you provide as a user. This Privacy Policy explains how we collect, share, and safeguard your data. It reflects our commitment to protecting your privacy and personal information. This policy applies to the collection, storage, processing, disclosure, and transfer of your Personal Information as per the relevant laws when using our Services. We aim to comply with legal requirements including the Information Technology Act of 2000 concerning data collection, processing, and transfer. Please read this Privacy Notice closely before using any of our products or services.
        </Text>

        <Text style={styles.sectionTitle}>1. What Information Do We Collect?</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>1.1. Personal Information:</Text>
          <Text style={styles.listItem}>
            • Email address, phone number, gender, date of birth, and pin code.
          </Text>
          <Text style={styles.listItem}>
            • Data concerning your usage of the services and appointment history.
          </Text>
          
          <Text style={styles.listItem}>1.2. Sensitive Information:</Text>
          <Text style={styles.listItem}>
            • Passwords; financial details such as bank account, credit card, debit card, or other payment instrument information.
          </Text>
          <Text style={styles.listItem}>
            • Physical, physiological, and mental health conditions; medical records and history; biometric information.
          </Text>
          
          <Text style={styles.listItem}>1.3. Cookies:</Text>
          <Text style={styles.listItem}>
            • Cookies are small data files stored on your web browser, used for technical administration, research and development, storage, previous browsing activities, and user administration.
          </Text>
          <Text style={styles.listItem}>
            • By visiting Book My Appointment, you consent to the placement of cookies. Cookies do not store personal information.
          </Text>
          <Text style={styles.listItem}>
            • We recommend periodically clearing cookies from your browser for optimal use.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>2. Use of Data</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>2.1. We use your data for:</Text>
          <Text style={styles.listItem}>
            • Technical administration and customization of the website.
          </Text>
          <Text style={styles.listItem}>
            • Investigating, enforcing, and resolving disputes.
          </Text>
          <Text style={styles.listItem}>
            • Addressing requests, queries, and complaints related to our services.
          </Text>
          <Text style={styles.listItem}>
            • Providing personalized services and targeted advertisements.
          </Text>
          <Text style={styles.listItem}>
            • Sending notices, communications, alerts, and new offers.
          </Text>
          <Text style={styles.listItem}>
            • Improving our business, products, and services.
          </Text>
          <Text style={styles.listItem}>
            • Fulfilling obligations with business partners or contractors.
          </Text>
          <Text style={styles.listItem}>
            • Contacting you to provide information on new services and offers.
          </Text>

          <Text style={styles.listItem}>2.2. Data Retention:</Text>
          <Text style={styles.listItem}>
            • Data is retained for up to 7 days for reinstatement of your account. Data is kept as needed to provide services or as required by law.
          </Text>
          <Text style={styles.listItem}>
            • Data may be retained in anonymized form for analytical and research purposes.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>3. Source of Data Collection</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>3.1. We collect information from:</Text>
          <Text style={styles.listItem}>
            • Direct interactions with our app, website, email, or other communication methods.
          </Text>
          <Text style={styles.listItem}>
            • Healthcare providers with your permission.
          </Text>
          <Text style={styles.listItem}>
            • Cookies and email interactions. You can opt-out of marketing emails using the unsubscribe link.
          </Text>
          <Text style={styles.listItem}>
            • Third-party websites and services using our technology. These are subject to their privacy policies.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>4.1. Partners:</Text>
          <Text style={styles.listItem}>
            • We may disclose information to business partners and affiliates involved in providing products and services.
          </Text>
          <Text style={styles.listItem}>
            • In the event of business expansion, information may be shared with new entities.
          </Text>
          
          <Text style={styles.listItem}>4.2. Service Providers:</Text>
          <Text style={styles.listItem}>
            • Information may be shared with service providers for data storage, software services, and marketing.
          </Text>
          <Text style={styles.listItem}>
            • We address suspected data breaches and reserve the right to disclose data as required by law or to protect against harm.
          </Text>
          
          <Text style={styles.listItem}>4.3. Third Parties:</Text>
          <Text style={styles.listItem}>
            • Information may be shared to maintain the security of our website or app.
          </Text>
          <Text style={styles.listItem}>
            • Data may be shared with employees, consultants, business partners, and technology partners on a need-to-know basis.
          </Text>
          <Text style={styles.listItem}>
            • Data may be shared with your healthcare providers.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>5.1. Security Measures:</Text>
          <Text style={styles.listItem}>
            • We adhere to industry-standard security practices to protect your data.
          </Text>
          <Text style={styles.listItem}>
            • We cannot be held liable for data loss or theft due to unauthorized access to your devices.
          </Text>
          <Text style={styles.listItem}>
            • Ensure the security of your electronic devices when using our services.
          </Text>
          
          <Text style={styles.listItem}>5.2. Contact:</Text>
          <Text style={styles.listItem}>
            • For concerns regarding data misuse or unauthorized access, contact us at bookmyappointment@gmail.com.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>6. Third-Party Websites and Services</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>6.1. Links to Third-Party Sites:</Text>
          <Text style={styles.listItem}>
            • Our website and app may link to third-party websites and services. Use these at your own risk.
          </Text>
          <Text style={styles.listItem}>
            • We are not responsible for any issues arising from the use of these third-party sites. Read their privacy policies before use.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  intro: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#222',
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: '#333',
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicy;
