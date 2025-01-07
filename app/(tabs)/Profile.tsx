import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function ProfileScreen() {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://192.168.0.102:3000/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.container}>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Ionicons
                            name="person-circle"
                            size={100}
                            color="#007BFF"
                            style={styles.avatarIcon}
                        />
                    </View>

                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <View style={styles.bookingsCard}>
                    <Text style={styles.cardTitle}>Bookings</Text>
                    <Text style={styles.bookingsInfo}>You have {user.bookings.length} booking(s).</Text>
                    <TouchableOpacity
                        style={styles.viewBookingsButton}
                        onPress={() => navigation.navigate('Bookings')} 
                    >
                        <Text style={styles.viewBookingsText}>View Bookings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.noProfileText}>No profile data available.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    avatarIcon: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    profileCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#007BFF',
    },
    userInfo: {
        alignItems: 'center',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#777',
        marginTop: 4,
    },
    bookingsCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
        marginTop: 20
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingsInfo: {
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },
    viewBookingsButton: {
        marginTop: 10,
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewBookingsText: {
        color: '#fff',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#c6fcff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noProfileText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
