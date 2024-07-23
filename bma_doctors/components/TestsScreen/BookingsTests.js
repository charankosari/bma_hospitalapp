import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
const MyBookings = () => {
  const route = useRoute();
  const { testid } = route.params; 
  const [loading, setLoading] = useState(true);
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/test/bookingdetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ testid }),
        });
        const textResponse = await response.text();
        const responseData = JSON.parse(textResponse);
        if (response.ok) {
          categorizeBookings(responseData.bookings);
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
      const today = new Date().toISOString().slice(0, 10); 
      const todayBookings = [];
      const upcomingBookings = [];
      const completedBookings = [];
      bookings.forEach((item) => {
        const bookingDate = new Date(item.booking.date).toISOString().slice(0, 10);
        if (bookingDate === today) {
          todayBookings.push(item);
        } else if (new Date(bookingDate) > new Date(today)) {
          upcomingBookings.push(item);
        } else {
          completedBookings.push(item);
        }
      });
      setTodayBookings(todayBookings);
      setUpcomingBookings(upcomingBookings);
      setCompletedBookings(completedBookings);
    };
    fetchBookingDetails();
  }, [testid]);
  const renderBookingCard = (item) => (
    <View key={item.booking._id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>Booking ID: {item.booking.id}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={20} color="#2BB673" />
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{item.booking.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={20} color="#2BB673" />
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{item.booking.phonenumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#2BB673" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item.booking.email}</Text>
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
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={20} color="#2BB673" />
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>{item.booking.amountpaid}</Text>
        </View>
        <Text>Booked on: {item.booking.bookedOn.split("T")[0]}</Text>
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
          {completedBookings.length > 0 && (
            <>
              <Text style={styles.header}>Completed Bookings</Text>
              {completedBookings.map((item) => renderBookingCard(item))}
            </>
          )}
          {todayBookings.length === 0 && upcomingBookings.length === 0 && completedBookings.length === 0 && (
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