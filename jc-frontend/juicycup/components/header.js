import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, Dimensions,
    TouchableOpacity, Pressable, TextInput,
    ScrollView, Picker,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome6, FontAwesome5 } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import MyModal from "./modal";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useAuth } from "../context/AuthContext";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { Dimensions } from "react-native";

const API_KEY = "AIzaSyDfMlfbHShXTZUc7_N-Q4j1hIK0yUnkWPc";
const pageWidth = Dimensions.get("window").width

const Header = () => {
    const [search, setSearch] = useState("");
    const [currentAddress, setCurrentAddress] = useState("Cliquer ici pour enregistrer une addresse de livraison.")

    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 0,
        longitude: 0,
        place_name: '',
        city: '',
        full_name: ''
    });

    const [selectedCurrentLocation, setSelectedCurrentLocation] = useState({
        latitude: 0,
        longitude: 0,
        place_name: '',
        city: '',
        full_name: ''
    });

    const handlePlaceSelected = (data, details = null) => {
        // console.log("details:", details);
        // console.log(JSON.stringify(details?.geometry?.location));

        // console.log("data:", details);

        const cityComponent = details.address_components.find(
            (component) => component.types.includes('locality'));

        const city = cityComponent ? cityComponent.long_name : '';

        // console.log('Selected City:', city);

        let latitude = details?.geometry?.location?.lat;
        let longitude = details?.geometry?.location?.lng;
        let place_name = data?.description
        let place_short_name = data?.terms[0].value;
        // let city = data?.terms[1].value;

        setSelectedLocation({
            latitude: latitude,
            longitude: longitude,
            place_name: place_short_name,
            city: city,
            full_name: place_name
        });
    };

    const renderConfirmButton = () => {
        if (selectedLocation.latitude !== 0 && selectedLocation.longitude !== 0) {
            return (
                <TouchableOpacity style={{ backgroundColor: '#212529', width: 85, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 10 }} onPress={handleConfirm}>
                    <Text style={{ color: '#fff', fontWeight: "bold" }}>Confirmer</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const handleConfirm = () => {
        console.log('Location confirmed:', selectedLocation);
        navigation.navigate('Address', { selectedLocationConfirmation: selectedLocation });
    };

    const { currentUser, findUser } = useAuth();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const onSelectDate = () => { setIsModalVisible(true); }
    const onModalClose = () => { setIsModalVisible(false); }

    const [coords, setCoords] = useState({
        latitude: 0,
        longitude: 0
    })

    const updateSearch = (search) => {
        setSearch(search);
    };

    const navigation = useNavigation();

    useEffect(() => {
        findUser();
    }, []);

    const fetchCurrentAddress = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                if (currentUser && currentUser.addresses && currentUser.addresses.length > 0) {
                    // Use Google Maps API to find the closest address
                    // Replace the following logic with your implementation
                    // You may need to fetch the user's saved addresses from Django backend
                    const closestAddress = await findClosestAddress(latitude, longitude, currentUser.addresses);
                    setCurrentAddress(closestAddress);
                } else {
                    // Use Google Maps API to find the name of the place
                    const address = await findPlaceName(latitude, longitude);
                    setCoords({ latitude: latitude, longitude: longitude })
                    setCurrentAddress(`${address.city_name}, ${address.name}`);

                    setSelectedCurrentLocation({
                        latitude: latitude,
                        longitude: longitude,
                        full_name: address.name,
                        place_name: address.name,
                        city: address.city_name
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching current address', error);
        }
    };

    useEffect(() => {
        fetchCurrentAddress();
        // console.log(currentAddress);
    }, [currentUser]);

    const findClosestAddress = async (latitude, longitude, addresses) => {
        // Implement logic to find the closest address using Google Maps API
        // You can use the logic similar to what you use for finding distances between two coordinates
        // Replace the following logic with your implementation
        return "Closest Address Name";
    }

    const findPlaceName = async (latitude, longitude) => {
        // Use Google Maps API to find the name of the place
        // Replace the following logic with your implementation
        const apiKey = 'AIzaSyDfMlfbHShXTZUc7_N-Q4j1hIK0yUnkWPc'
        const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        try {
            const response = await fetch(geocodingApiUrl);
            const data = await response.json();

            if (data.status === 'OK') {
                const cityComponent = data.results[0].address_components.find(
                    (component) => component.types.includes('locality')
                );
                const city = cityComponent ? cityComponent.long_name : '';
                return { name: data.results[0].formatted_address, city_name: city };
            } else {
                console.error('Geocoding API request failed with status:', data.status);
                return "Cliquer ici pour enregistrer une addresse de livraison.";
            }
        } catch (error) {
            console.error('Error fetching from Geocoding API:', error);
            return "Cliquer ici pour enregistrer une addresse de livraison.";
        }
    };

    const displayedAddress = (text) => {
        const letters = currentAddress.split("");

        return text.split('').map((letter, index) => (
            <Text key={index} style={styles.headerTextSecondary}>
                {letter}
            </Text>
        ))
    }

    return (
        <View>
            <View style={styles.header}>
                <View style={{ width: "80%" }}>
                    <Text style={styles.headerTextPrimary}>
                        Bienvenue
                        {currentUser ? (` ${currentUser.user.first_name}`) : (' User')}
                    </Text>
                    <View style={{ height: 15, }}></View>
                    <TouchableOpacity onPress={onSelectDate} style={styles.header}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', gap: 5,
                            width: "85%",
                        }}>
                            <MaterialIcons name="location-pin" size={20} color={'white'} />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTextSecondary}>{
                                currentAddress
                            }</Text>
                            {/* <View style={{ flexDirection: "row", flexWrap: "wrap", maxWidth: "100%" }}>
                                {currentAddress.split('').map((letter, index) => (
                                    <Text key={index} style={[styles.headerTextSecondary, { marginRight: 2 }]}>
                                        {letter}
                                    </Text>
                                ))}
                            </View> */}
                        </View>
                        <View>
                            <MaterialIcons name="arrow-drop-down" size={20} color={'white'} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ paddingRight: 10, }}>
                    <Ionicons name="person-circle-outline" size={45} color={'white'} />
                </TouchableOpacity>
            </View>

            <View style={{ height: 15, }}></View>
            <View >
                <SearchBar
                    round
                    onChangeText={updateSearch}
                    value={search}
                    placeholder="Search..."
                    platform="default"
                    containerStyle={{ backgroundColor: "transparent", borderBlockColor: 'transparent' }}
                    inputContainerStyle={{ backgroundColor: "white" }}
                    ref={search => this.search = search}
                />
            </View>

            <MyModal
                isVisible={isModalVisible}
                onClose={onModalClose}
                title={"Enregistre ton adresse de Livraison"}
                height={"75%"}
                curve={20}
                children={
                    <View style={{ paddingTop: 10 }}>
                        <View style={{ marginBottom: 75 }}>
                            <GooglePlacesAutocomplete
                                GooglePlacesDetailsQuery={{ fields: 'address_components,geometry' }}
                                fetchDetails={true}
                                placeholder="Chercher votre addresse"
                                onPress={handlePlaceSelected}
                                query={{
                                    key: API_KEY,
                                    language: 'fr',
                                    components: 'country:cm',
                                }}
                                debounce={300}
                                // enablePoweredByContainer={false}
                                onFail={(error) => console.error(error)}
                                minLength={3}
                                styles={{
                                    textInputContainer: {
                                        borderColor: '#21252980',
                                        borderWidth: 0.5,
                                        borderRadius: 10,
                                        padding: 5,
                                        backgroundColor: '#fff'
                                    },
                                    textInput: {
                                        backgroundColor: '#fff',
                                        height: '100%',
                                    },
                                    container: {
                                        position: "absolute",
                                        top: 10,
                                        left: 20,
                                        right: 0,
                                        width: pageWidth - 40,
                                        zIndex: 1,
                                        gap: 5,
                                    },
                                    // row: {
                                    //     borderColor: '#21252980',
                                    //     borderLeftWidth: 0.5,
                                    //     borderRightWidth: 0.5,
                                    //     borderTopWidth: 0.5
                                    // },
                                    separator: {
                                        backgroundColor: '#21252980'
                                    },
                                    listView: {
                                        borderColor: "#21252980",
                                        borderWidth: 0.5,
                                        // backgroundColor: '#000',
                                        // borderTopLeftRadius: 10,
                                        // borderTopRightRadius: 10,
                                    },
                                }}
                            />
                        </View>

                        <TouchableOpacity onPress={async () => {
                            onModalClose();
                            console.log(selectedCurrentLocation);
                            navigation.navigate('Address', { selectedLocationConfirmation: selectedCurrentLocation });
                        }}
                            style={{ paddingHorizontal: 30, flexDirection: 'row', gap: 15, alignItems: "center", marginBottom: 20 }}
                        >
                            <MaterialIcons name="my-location" size={20} color={'green'} />
                            <Text style={{ color: 'green' }}>Utiliser votre emplacement actuel</Text>
                        </TouchableOpacity>

                        <View style={{ paddingHorizontal: 25, alignItems: "flex-end" }}>
                            {renderConfirmButton()}
                        </View>

                        <ScrollView>
                            <View style={{ paddingHorizontal: 30, flexDirection: 'row', gap: 15, alignItems: "center", marginVertical: 20 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Addresses Enregistrees</Text>
                            </View>

                            <View style={{ paddingHorizontal: 30, flexDirection: 'row', gap: 15, alignItems: "center" }}>
                                <View style={{ borderTopWidth: 1, width: '100%', borderTopColor: 'rgba(128, 128, 128, 0.3)', padding: 15, flexDirection: "row", gap: 20, alignItems: "center" }}>
                                    <FontAwesome5 name="street-view" size={20} color={"grey"} />
                                    <View>
                                        <Text style={{ color: 'grey', fontWeight: "bold" }}>Vous n'avez pas enregistrer d'addresses</Text>
                                        <Text style={{ color: 'grey', fontSize: 11 }}>Enregistrer une addresses au dessus.</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                }
            />
        </View >
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTextSecondary: {
        fontWeight: 'bold',
        color: '#fff',
        // letterSpacing: 0.01,
    },
    headerTextPrimary: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#fff',
        letterSpacing: 1,
    }
})

export default Header;