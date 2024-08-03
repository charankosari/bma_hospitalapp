import React from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';

const TermsAndConditions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Terms and Conditions</Text>

        <Text style={styles.intro}>
          Welcome to Book My Appointment! By accessing or using the app, you agree to abide by the terms and conditions outlined in this User Agreement. If you do not agree with any part of these terms, please do not use the app.
        </Text>

        <Text style={styles.sectionTitle}>1. What is Book My Appointment</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Book My Appointment is an online platform designed to facilitate the seamless scheduling and cancellation of in-person appointments & Lab Tests.
          </Text>
          <Text style={styles.listItem}>
            • The service eliminates the need for prolonged waiting periods at medical facilities.
          </Text>
          <Text style={styles.listItem}>
            • The registered office is at [Company Address]. The term "Website" refers to both the domain name and the mobile application.
          </Text>
          <Text style={styles.listItem}>
            • By using our Services, you agree to adhere to these Terms of Use and consent to be bound by our policies, including the Privacy Policy.
          </Text>
          <Text style={styles.listItem}>
            • Your continued use signifies acceptance of changes. Regular review of these Terms is recommended.
          </Text>
          <Text style={styles.listItem}>
            • You must be at least 18 years old to use the Website. By accepting these Terms, you confirm you are of legal age and have the capacity to use the Website.
          </Text>
          <Text style={styles.listItem}>
            • These Terms of Use are governed by Indian laws, including the Indian Contract Act, 1872, and the Information Technology Act, 2000.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>2. Proprietary Rights</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • By accepting these Terms & Conditions, you acknowledge that Book My Appointment owns all rights to the Services, including intellectual property rights.
          </Text>
          <Text style={styles.listItem}>
            • Services may contain confidential information that you shall only disclose with prior written consent from Book My Appointment.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>3. User Eligibility</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • You must be at least 18 years old to use this app. By using the app, you represent that you are 18 years old or using it under the supervision of a parent or guardian.
          </Text>
          <Text style={styles.listItem}>
            • You agree not to use the app for commercial purposes and to provide accurate and current information.
          </Text>
          <Text style={styles.listItem}>
            • Inform us about any suspected login or security breaches. We may suspend your account temporarily or permanently for violations.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>4. Our Services</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • We frequently initiate promotions and special deals to enhance your experience. Enable notifications to receive updates.
          </Text>
          <Text style={styles.listItem}>
            • Notifications and offers are disseminated via email. Ensure notifications are enabled.
          </Text>
          <Text style={styles.listItem}>
            • Our website may feature links to third-party sites that are not governed by our terms. Click at your own risk.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>5. Cookies</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • We use cookies to enable functionality and improve user experience. By accessing Book My Appointment, you agree to our use of cookies as outlined in our Privacy Policy.
          </Text>
          <Text style={styles.listItem}>
            • Cookies help retrieve user data for each visit. Some partners may also use cookies.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>6. Terms of Use</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • We collect information and cookies to improve your experience and send personalized offers. We may access your email or phone number for communication.
          </Text>
          <Text style={styles.listItem}>
            • Do not share your password. Report unauthorized access immediately. While we are not responsible for unauthorized use, you may be liable for related losses.
          </Text>
          <Text style={styles.listItem}>
            • Provide accurate information. Inaccurate information may result in discontinuation of services.
          </Text>
          <Text style={styles.listItem}>
            • For queries or complaints, call xxxxxxx00. Calls will be recorded for quality and training purposes.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>7. Prohibition Content</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Using content from the Website is prohibited. Submitting inaccurate information or spreading harmful news is not allowed.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>8. Data Privacy</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Detailed data collection practices are provided in our Privacy Policy.
          </Text>
          <Text style={styles.listItem}>
            • Gathering and usage of sensitive personal information, disclosure practices, and rights available to users.
          </Text>
          <Text style={styles.listItem}>
            • Consent to contact from us or third-party providers, including promotions and service-related communications.
          </Text>
          <Text style={styles.listItem}>
            • Information accuracy and consequences of providing false information.
          </Text>
          <Text style={styles.listItem}>
            • Information use for debugging support issues.
          </Text>
          <Text style={styles.listItem}>
            • Customer support calls are recorded for quality control.
          </Text>
          <Text style={styles.listItem}>
            • Prescriptions will be securely uploaded and stored.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>9. No-show</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • If you schedule an appointment but fail to cancel or reschedule, you will be credited 60% of the consultation fee (excluding taxes) as a refund.
          </Text>
          <Text style={styles.listItem}>
            • Repeated no-shows may result in no refunds to prevent misuse.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>10. Doctor Consultation Terms & Conditions</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Book My Appointment operates as an offline consultation and diagnostic platform. We are not responsible for third-party aggregators or medical advice provided by physicians.
          </Text>
          <Text style={styles.listItem}>
            • Consultations are facilitated by third-party aggregators. Book My Appointment is not liable for delays or miscommunications.
          </Text>
          <Text style={styles.listItem}>
            • The platform is for personal use only and not for commercial or illegal purposes.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>11. Refund & Payments</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Accepted payment methods include UPI, Net banking, credit cards, etc., via Razorpay. Adhere to the payment gateway’s terms and privacy policy.
          </Text>
          <Text style={styles.listItem}>
            • Book My Appointment reserves the right to modify fees. All fees are exclusive of taxes.
          </Text>
          <Text style={styles.listItem}>
            • Refunds follow the third-party aggregator's policy. Processing time is 5-7 business days.
          </Text>
          <Text style={styles.listItem}>
            • Payment aggregators may restrict transactions based on various factors.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>12. Updates</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Book My Appointment reserves the right to update these Terms & Conditions. You will be notified of essential updates. Review updated terms regularly.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>13. Liability</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • Book My Appointment is not liable for issues encountered while using the app or third-party services. We are not responsible for services provided by doctors or third-party aggregators.
          </Text>
          <Text style={styles.listItem}>
            • Use of links to third-party sites is at your own risk. Book My Appointment is not liable for third-party content.
          </Text>
          <Text style={styles.listItem}>
            • Sharing medical history is at your own risk. Book My Appointment may retain such information for service provision.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>14. Indemnity</Text>
        <View style={styles.listContainer}>
          <Text style={styles.listItem}>
            • You must indemnify Book My Appointment for any losses due to misrepresentations or misuse of the platform.
          </Text>
          <Text style={styles.listItem}>
            • Any violation of Terms & Conditions may lead to claims, liabilities, and costs, including legal fees.
          </Text>
          <Text style={styles.listItem}>
            • Use of unauthorized credit/debit cards is prohibited.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  intro: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default TermsAndConditions;