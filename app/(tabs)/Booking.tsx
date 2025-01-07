import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import axios from 'axios';

interface Booking {
    id: string;
    propertyId: string;
    userId: string;
    checkIn: string;
    checkOut: string;
    status: string;
}

interface Property {
    id: string;
    title: string;
    price: number;
    location: {
        address: string;
        city: string;
        state: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    features: string[];
    images: string[];
}

export default function BookingsScreen() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const bookingsResponse = await axios.get('http://192.168.0.102:3000/bookings');
                const propertiesResponse = await axios.get('http://192.168.0.102:3000/properties');
                setBookings(bookingsResponse.data);
                setProperties(propertiesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
        try {

            await axios.delete(`http://192.168.0.102:3000/bookings/${bookingId}`);
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            setCancelSuccess(true);
            setModalVisible(true);
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    const renderBooking = ({ item }: { item: Booking }) => {

        const property = properties.find((property) => property.id === item.propertyId);

        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Booking ID: {item.id}</Text>
                        <Text style={styles.cardText}>Property ID: {item.propertyId}</Text>
                        <Text style={styles.cardText}>User ID: {item.userId}</Text>
                        <Text style={styles.cardText}>Check-In: {item.checkIn}</Text>
                        <Text style={styles.cardText}>Check-Out: {item.checkOut}</Text>
                        <Text style={[styles.cardText, { color: item.status === 'confirmed' ? 'green' : 'red' }]}>
                            Status: {item.status}
                        </Text>
                    </View>


                    {property && (
                        <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
                    )}
                </View>


                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                renderItem={renderBooking}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No bookings available.</Text>}
            />


            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Booking has been canceled successfully!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        flexDirection: 'column',
        alignItems: 'stretch',
        marginHorizontal: 10,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    propertyImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#FF474C',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },


    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 400,
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
