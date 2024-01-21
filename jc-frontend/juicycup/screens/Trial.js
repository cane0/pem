
import React, { useCallback, useState } from 'react';
import { View, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const API_KEY = "AIzaSyDfMlfbHShXTZUc7_N-Q4j1hIK0yUnkWPc";

const GooglePlacesAutoCompleteComponent = () => {
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 0,
        longitude: 0,
        country: '',
        city: '',
    });

    const [currentLocation, setCurrentLocation] = useState(null);

    const handlePlaceSelected = (data, details = null) => {
        console.log("details: ", details);
        console.log(JSON.stringify(details?.geometry?.location));

        let country = '';
        let city = '';
        let latitude = '';
        let longitude = '';

        setSelectedLocation({
            latitude,
            longitude,
            country,
            city,
        });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>

            {/* <View>

            </View> */}
            <GooglePlacesAutocomplete
                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                fetchDetails={true}
                placeholder="Search"
                onPress={handlePlaceSelected}
                query={{
                    key: API_KEY, // Replace with your API key
                    language: 'en',
                }}
                debounce={300}
                enablePoweredByContainer={false}
                onFail={(error) => console.error(error)}
            // styles={{
            //     container: {
            //         position: 'absolute',
            //         top: 10,
            //         left: 0,
            //         right: 0,
            //     },
            //     textInputContainer: {
            //         width: '50%',
            //         backgroundColor: 'transparent',
            //     },
            //     description: {
            //         fontWeight: 'bold',
            //     },
            //     predefinedPlacesDescription: {
            //         color: '#1faadb',
            //     },
            // }}
            />
        </View>
    );
}


export default GooglePlacesAutoCompleteComponent;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import * as Location from 'expo-location';

// const MapScreen = () => {
//     const [currentLocation, setCurrentLocation] = useState(null);

//     const getCurrentLocation = async () => {
//         try {
//             const { status } = await Location.requestForegroundPermissionsAsync();
//             if (status === 'granted') {
//                 const location = await Location.getCurrentPositionAsync({});
//                 setCurrentLocation(location.coords);
//                 console.log('Current Location:', location.coords);
//             } else {
//                 console.log('Permission denied');
//             }
//         } catch (error) {
//             console.error('Error getting location:', error);
//         }
//     };

//     useEffect(() => {
//         // Optional: You can get the current location when the component mounts
//         getCurrentLocation();
//     }, []);

//     return (
//         <View>
//             <Text>Map Screen</Text>
//             <Button title="Get Current Location" onPress={getCurrentLocation} />
//             {currentLocation && (
//                 <Text>
//                     Current Location: {currentLocation.latitude}, {currentLocation.longitude}
//                 </Text>
//             )}
//         </View>
//     );
// };

// export default MapScreen;

{/* <MapView
            style={{ flex: 1 }}
            region={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }} // Handle map press to set a new location
        >
            <Marker
                coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                }}
                title={selectedLocation.city}
                description={selectedLocation.country} // Event handler for marker drag end
            />
        </MapView> */}
