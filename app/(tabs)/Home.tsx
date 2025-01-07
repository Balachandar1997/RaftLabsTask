import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
    ScrollView
} from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {

    interface PropertyLocation {
        address: string;
        city: string;
        state: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    }

    interface Property {
        id: string;
        title: string;
        price: number;
        location: PropertyLocation;
        features: string[];
        images: string[];
    }


    const [searchQuery, setSearchQuery] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState(properties);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");


    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get("http://192.168.0.102:3000/properties");
                setProperties(response.data);
                setFilteredProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);


    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            setFilteredProperties(
                properties.filter(
                    (property) =>
                        property.title.toLowerCase().includes(query.toLowerCase()) ||
                        property.location.city.toLowerCase().includes(query.toLowerCase())
                )
            );
        } else {
            setFilteredProperties(properties);
        }
    };

    const handleBooking = async (propertyId: string) => {
        const userId = "user123";
        const checkIn = "2025-01-10";
        const checkOut = "2025-01-15";

        try {
            const response = await axios.post("http://192.168.0.102:3000/bookings", {
                propertyId,
                userId,
                checkIn,
                checkOut,
                status: "pending",
            });
            alert("Booking Successful!");
        } catch (error) {
            console.error("Error making booking:", error);
            alert("Booking Failed. Please try again.");
        }
    };


    const renderProperty = ({ item }: { item: Property }) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => setSelectedProperty(item)}
        >
            <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
            <View style={styles.propertyDetails}>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyPrice}>${item.price} per night</Text>
                <Text style={styles.propertyLocation}>
                    {item.location.city}, {item.location.state}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleBooking(item.id)} style={styles.booknow1}>
                <Text style={styles.booknow}>Book Now</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );


    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    if (selectedProperty) {

        if (!selectedImage) {
            setSelectedImage(selectedProperty.images[0]);
        }

        return (
            <ScrollView>
                <View style={styles.propertyDetailsContainer}>

                    <TouchableOpacity onPress={() => setSelectedProperty(null)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                        <Text style={styles.backButtonText}>Back to Properties</Text>
                    </TouchableOpacity>


                    <Image source={{ uri: selectedImage }} style={styles.propertyImageLarge} />
                    <View style={styles.thumbnailContainer}>
                        {selectedProperty.images.map((imageUrl, index) => (
                            <TouchableOpacity key={index} onPress={() => setSelectedImage(imageUrl)}>
                                <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                    <Text style={styles.propertyPrice}>${selectedProperty.price} per night</Text>
                    <Text style={styles.propertyLocation}>
                        {selectedProperty.location.city}, {selectedProperty.location.state}
                    </Text>


                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: selectedProperty.location.coordinates.latitude,
                            longitude: selectedProperty.location.coordinates.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: selectedProperty.location.coordinates.latitude,
                                longitude: selectedProperty.location.coordinates.longitude,
                            }}
                            title={selectedProperty.title}
                            description={selectedProperty.location.address}
                        />
                    </MapView>


                    <Text style={styles.propertyFeatures}>Features:</Text>
                    {selectedProperty.features.map((item, index) => (
                        <Text key={index} style={styles.propertyFeatureItem}>- {item}</Text>
                    ))}





                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => handleBooking(selectedProperty.id)}
                    >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by title or city..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredProperties}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    searchBar: { marginBottom: 16, padding: 10, borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
    propertyCard: { marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden" },
    propertyImage: { width: "100%", height: 150 },
    propertyDetails: { padding: 10 },
    propertyTitle: { fontSize: 16, fontWeight: "bold" },
    propertyPrice: { fontSize: 14, color: "green" },
    propertyLocation: { fontSize: 14, color: "gray" },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },


    propertyDetailsContainer: { flex: 1, padding: 16, backgroundColor: '#fff' },
    propertyImageLarge: { width: "100%", height: 250, marginBottom: 16 },
    propertyFeatures: { fontSize: 18, marginVertical: 8 },
    propertyFeatureItem: { fontSize: 16, marginVertical: 4 },
    map: { width: "100%", height: 200, marginVertical: 16 },
    backButton: { flexDirection: "row", backgroundColor: '#000', alignItems: "center", marginBottom: 16, padding: 10, borderRadius: 5 },
    backButtonText: { marginLeft: 8, fontSize: 16, color: "#fff" },
    bookButton: { marginTop: 20, padding: 10, backgroundColor: "#000", borderRadius: 8 },
    bookButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
    booknow: { color: "#fff", backgroundColor: '#000', height: 40, textAlign: 'center', paddingTop: 10 },
    booknow1: { backgroundColor: '#000' },


    thumbnailContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginBottom: 10,
        marginRight: 10,
    }
});

export default HomeScreen;
