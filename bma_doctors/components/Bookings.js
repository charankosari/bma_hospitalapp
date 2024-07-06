import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Importing icons from expo

const MyBookings = () => {
  const [loading, setLoading] = useState(true);
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const response = await fetch('https://server.bookmyappointments.in/api/bma/allbookingdetails', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const responseData = await response.json();
        if (response.ok) {
          categorizeBookings(responseData.bookingDetails);
        } else {
          console.error('Error fetching booking details:', responseData.message);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    const categorizeBookings = (bookings) => {
      const today = new Date().toISOString().slice(0, 10); // Today's date in ISO format (YYYY-MM-DD)
      const todayBookings = [];
      const upcomingBookings = [];

      bookings.forEach((item) => {
        const bookingDate = new Date(item.booking.date).toISOString().slice(0, 10);
        if (bookingDate === today) {
          todayBookings.push(item);
        } else if (new Date(bookingDate) > new Date(today)) {
          upcomingBookings.push(item);
        }
      });

      setTodayBookings(todayBookings);
      setUpcomingBookings(upcomingBookings);
    };

    fetchBookingDetails();
  }, []);

  const renderBookingCard = (item) => (
    <View key={item.booking._id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>Booking ID: {item.booking.id}</Text>
      </View>
      <View style={styles.cardContent}>
        {item.doctor && (
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#2BB673" />
            <Text style={styles.label}>Doctor Name:</Text>
            <Text style={styles.value}>{item.doctor.name}</Text>
          </View>
        )}
        {item.test && (
          <View style={styles.infoRow}>
            <MaterialIcons name="assignment" size={20} color="#2BB673" />
            <Text style={styles.label}>Test Name:</Text>
            <Text style={styles.value}>{item.test.name.charAt(0).toUpperCase() + item.test.name.slice(1)}</Text>
          </View>
        )}
        {item.hospital && (
          <View style={styles.infoRow}>
            <MaterialIcons name="local-hospital" size={20} color="#2BB673" />
            <Text style={styles.label}>{item.hospital.hospitalName.includes('lab') ? 'Lab Name:' : 'Hospital Name:'}</Text>
            <Text style={styles.value}> {item.hospital.hospitalName.charAt(0).toUpperCase() + item.hospital.hospitalName.slice(1)}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={20} color="#2BB673" />
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{item.hospital ? item.hospital.contact : 'Not Available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={20} color="#2BB673" />
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(item.booking.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color="#2BB673" />
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{item.booking.time}</Text>
        </View>
        <Text>Booked on :{item.booking.bookedOn.split("T")[0]}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2BB673" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {todayBookings.length > 0 && (
            <>
              <Text style={styles.header}>Today's Bookings</Text>
              {todayBookings.map((item) => renderBookingCard(item))}
            </>
          )}

          {upcomingBookings.length > 0 && (
            <>
              <Text style={styles.header}>Upcoming Bookings</Text>
              {upcomingBookings.map((item) => renderBookingCard(item))}
            </>
          )}

          {todayBookings.length === 0 && upcomingBookings.length === 0 && (
            <Text style={styles.noBookingsText}>No bookings found.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardContent: {
    paddingVertical: 10,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  noBookingsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default MyBookings;
