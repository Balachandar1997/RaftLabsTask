import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";

const PropertyDetails = ({ route }: any) => {
    const { property } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Text style={styles.propertyPrice}>${property.price} per night</Text>
            <Text style={styles.propertyAddress}>{property.location.address}</Text>
            <Text style={styles.featuresTitle}>Features:</Text>
            <View>
                {property.features.map((feature: string, index: number) => (
                    <Text key={index} style={styles.featureText}>
                        - {feature}
                    </Text>
                ))}
            </View>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: property.location.coordinates.latitude,
                    longitude: property.location.coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: property.location.coordinates.latitude,
                        longitude: property.location.coordinates.longitude,
                    }}
                    title={property.title}
                />
            </MapView>
            <Button title="Book Now" onPress={() => alert("Booking functionality")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    propertyImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    propertyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 8,
    },
    propertyPrice: {
        fontSize: 18,
        color: "green",
        marginVertical: 4,
    },
    propertyAddress: {
        fontSize: 16,
        color: "gray",
    },
    featuresTitle: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: "bold",
    },
    featureText: {
        fontSize: 16,
        marginVertical: 2,
    },
    map: {
        height: 200,
        marginVertical: 16,
    },
});

export default PropertyDetails;
