import { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View, Text, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    FontAwesome, FontAwesome5, AntDesign,
    MaterialIcons, MaterialCommunityIcons, Ionicons
} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
// import { Audio } from "expo-av";

const OrderSuccess = () => {
    const navigation = useNavigation();
    const [countdown, setCountdown] = useState(10);
    const [showPopup, setShowPopup] = useState(true);
    const route = useRoute();
    const { orderId } = route.params;

    // const [sound, setSound] = useState();

    // const playSound = async () => {
    //     console.log('Loading Sound');
    //     const { sound } = await Audio.Sound.createAsync(require('../assets/Saturday at 3-12 PM.m4a'));
    //     setSound(sound);

    //     console.log('Playing Sound');
    //     await sound.playAsync();
    // }

    // useEffect(() => {
    //     return sound ? () => {
    //         console.log('Unloading Sound');
    //         sound.unloadAsync();
    //     } : undefined;
    // }, [sound]);

    // useEffect(() => {
    //     playSound();
    // }, []);

    const redirect = () => {
        setShowPopup(false);

        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
        });

        { navigation.navigate('Summary', { orderId: orderId }) }
    }

    useEffect(() => {
        if (showPopup) {

            const timeout = setTimeout(() => {
                // setShowPopup(false);
                redirect()
            }, 10000);

            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => {
                clearTimeout(timeout);
                clearInterval(countdownInterval);
            };
        }
    }, [showPopup, navigation]);

    return (
        <View style={styles.container}>
            {showPopup && (
                <View style={styles.popup}>
                    <View style={{ marginBottom: 25 }}>
                        <Text style={styles.popupText}>Votre commande a bien ete passee</Text>
                    </View>
                    <Animatable.View
                        animation="pulse"
                        easing="ease-out"
                        iterationCount="infinite"
                        style={{ textAlign: 'center' }}>
                        <Pressable onPress={redirect} style={{ backgroundColor: "green", width: 70, height: 70, alignItems: "center", justifyContent: "center", borderRadius: 300 }}>
                            <Ionicons name="checkmark-sharp" size={50} color="#fff" />
                        </Pressable>
                    </Animatable.View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ textAlign: "center" }}>Vous serez rediriger vers votre commandes dans {countdown} secondes</Text>
                        {/* <Text style={{ textAlign: "center" }}>Vous serez rediriger vers votre commande dans secondes</Text> */}
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%'
    },
    popupText: {
        fontSize: 17.5,
        marginTop: 10,
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default OrderSuccess;