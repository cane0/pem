
import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, StyleSheet,
    ImageBackground, Animated, Easing,
    Dimensions, ScrollView, Pressable,
    TouchableOpacity, Alert
} from 'react-native';
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DevelopedBy, { API_BASE_URL } from "../context/constants";

const pageWidth = Dimensions.get("window").width;
const pageHeight = Dimensions.get("window").height;

const client = axios.create({
    baseURL: API_BASE_URL,
});

const LoginScreen = () => {
    const { currentUser, login, findUser } = useAuth();

    const [registrationToggle, setRegistrationToggle] = useState(false);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');

    const [csrftoken, setCsrftoken] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(true);

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/get-csrf-token/`);
                const token = response.data.csrftoken;
                setCsrftoken(token);
                // console.log('CSRF Token:', token, `${API_BASE_URL}api/get-csrf-token/`);
            } catch (error) {
                console.error('Error retrieving CSRF token:', error);
                // console.log(csrftoken);
            }
        };

        // Call the function to get CSRF token when the component mounts
        getCsrfToken();
    }, []);

    // useEffect(() => {
    //     if (phoneNumber === '') {
    //         setIsOtpSent(false);
    //     }
    // }, [phoneNumber])

    const updateFormBtn = () => {
        setOtp('');
        setRegistrationToggle(!registrationToggle);
    };

    const isButtonDisabled = () => {

        return (
            errorMessage ||
            emailErrorMessage ||
            usernameErrorMessage ||
            !email ||
            !username ||
            !firstName ||
            !lastName
        );
    };

    const SendOTP = async () => {
        try {
            const hasCountryCode = phoneNumber.startsWith('+');

            const formattedPhoneNumber = hasCountryCode ? phoneNumber : `+225${phoneNumber}`;

            console.log(formattedPhoneNumber);

            const response = await client.post('/api/send-otp/', { phone_number: formattedPhoneNumber, otp: '2315' }, {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                }
            });

            setIsOtpSent(false);
            if (response.data.account === 'new account') {
                updateFormBtn();
            } else {
                console.log(response.data.error)
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                setErrorMessage(error.response.data.message || "An error occurred");
            } else if (error.request) {
                setErrorMessage("Vous n'etes pas en ligne");
            } else {
                setErrorMessage("Ta maman");
            }
        }
    };

    const VerifyOTP = async () => {

        const hasCountryCode = phoneNumber.startsWith('+225');

        const formattedPhoneNumber = hasCountryCode ? phoneNumber : `+225${phoneNumber}`;

        console.log(formattedPhoneNumber);

        try {
            const response = await client.post('/api/verify-otp/', {
                phone_number: formattedPhoneNumber, otp: otp,
                email: email, username: username,
                first_name: firstName, last_name: lastName,
            }, {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                }
            });
            if (response.data.account) {
                login();
            } else {
                console.log(response.data.error)
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                setErrorMessage(error.response.data.message || "An error occurred");
            } else if (error.request) {
                // console.error("No response received from the server");
                setErrorMessage("Vous n'etes pas en ligne");
            } else {
                setErrorMessage("Ta maman");
            }
        }
    }

    const handleUsernameChange = async (text) => {
        const cleanedUsername = text.replace(/\s/g, '').toLowerCase();
        setUsername(cleanedUsername);
        if (text.length >= 3) {

            const response = await axios.post(`${API_BASE_URL}api/check-something/`, {
                key: 'username',
                value: text,
            }, {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                }
            })

            if (response.data.exists) {
                setUsernameErrorMessage('Ce nom d\'utilisateur existe deja');
            } else {
                setUsernameErrorMessage('');
            }
        }
    };

    const handleEmailChange = async (text) => {
        setEmail(text.toLowerCase());
        if (text.length >= 5) {

            const response = await axios.post(`${API_BASE_URL}api/check-something/`, {
                key: 'email',
                value: text,
            }, {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                }
            })

            if (response.data.exists) {
                setEmailErrorMessage('Cet email existe deja');
            } else {
                setEmailErrorMessage('');
            }
        }
    };

    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: pageWidth * 5,
                easing: Easing.linear,
                useNativeDriver: false
            })
        ).start();
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 3],
        outputRange: [0, pageWidth * - 1],
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
                {
                    registrationToggle ? (
                        <View style={{ height: "100%" }}>
                            <View style={{ height: '48%', flexDirection: 'row', overflow: "hidden" }}>
                                <Animated.Image
                                    source={require('../assets/3.png')}
                                    style={{
                                        width: pageWidth,
                                        height: pageHeight * 0.58,
                                        transform: [{ translateX }],
                                    }}
                                />
                                <Animated.Image
                                    source={require('../assets/3.png')}
                                    style={{
                                        width: pageWidth,
                                        height: pageHeight * 0.58,
                                        marginLeft: pageWidth * -1,
                                        transform: [{ translateX: Animated.add(translateX, pageWidth) }],
                                    }}
                                />
                            </View>
                            <View style={{ height: '52%', paddingBottom: 10, alignItems: "center" }}>
                                <View style={{ height: 80, width: 80, marginTop: 20, marginBottom: 5 }}>
                                    <ImageBackground source={require('../assets/1.png')} resizeMode="cover" style={styles.backgroundImage} />
                                </View>
                                <View style={{ gap: 5, alignItems: "center", marginBottom: 10 }}>
                                    <Text style={{ color: "#212529", fontSize: 20, fontWeight: "bold" }}>
                                        JuicyCup
                                    </Text>
                                    <Text style={{ color: "#212529", fontWeight: "bold" }}>
                                        Cree ton compte Aujourd'hui!
                                    </Text>
                                </View>

                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        value={phoneNumber}
                                        editable={false}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>

                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre le code de confirmation recu par SMS"
                                        value={otp}
                                        onChangeText={(text) => setOtp(text)}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>

                                {emailErrorMessage !== '' && <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 7.5 }}><Text style={{ color: 'red' }}>{emailErrorMessage}</Text></View>}
                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre ton adresse email"
                                        value={email}
                                        onChangeText={handleEmailChange}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>

                                {usernameErrorMessage !== '' && <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 7.5 }}><Text style={{ color: 'red' }}>{usernameErrorMessage}</Text></View>}
                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre un nom d'utilisateur"
                                        value={username}
                                        onChangeText={handleUsernameChange}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>

                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre ton Prénom"
                                        value={firstName}
                                        onChangeText={(text) => setFirstName(text)}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>
                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre ton Nom"
                                        value={lastName}
                                        onChangeText={(text) => setLastName(text)}
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>
                                <View style={{ width: "100%", paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <View>
                                        <TouchableOpacity onPress={updateFormBtn}>
                                            <Text style={{ color: '#0000FF' }}>J'ai deja un compte</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        onPress={VerifyOTP}
                                        disabled={isButtonDisabled()}
                                        style={{
                                            backgroundColor: isButtonDisabled() ? "#21252980" : "#212529",
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '40%',
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: "bold", textAlign: 'center' }}>Cree mon compte</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ height: "100%" }}>
                            <View style={{ height: '52%', flexDirection: 'row', overflow: "hidden" }}>
                                <Animated.Image
                                    source={require('../assets/3.png')}
                                    style={{
                                        width: pageWidth,
                                        height: pageHeight * 0.58,
                                        transform: [{ translateX }],
                                    }}
                                />
                                <Animated.Image
                                    source={require('../assets/3.png')}
                                    style={{
                                        width: pageWidth,
                                        height: pageHeight * 0.58,
                                        marginLeft: pageWidth * -1,
                                        transform: [{ translateX: Animated.add(translateX, pageWidth) }],
                                    }}
                                />
                            </View>
                            <View style={{ height: '48%', paddingBottom: 10, alignItems: "center" }}>
                                <View style={{ height: 80, width: 80, marginTop: 20, marginBottom: 5 }}>
                                    <ImageBackground source={require('../assets/1.png')} resizeMode="cover" style={styles.backgroundImage} />
                                </View>
                                <View style={{ gap: 5, alignItems: "center", marginBottom: 10 }}>
                                    <Text style={{ color: "#212529", fontSize: 20, fontWeight: "bold" }}>
                                        JuicyCup
                                    </Text>
                                    <Text style={{ color: "#212529", fontWeight: "bold" }}>
                                        Entre tes info pour te connecter
                                    </Text>
                                </View>

                                {errorMessage !== '' && <Text>{errorMessage}</Text>}

                                <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                    <TextInput
                                        placeholder="Entre ton numero de telephone"
                                        value={phoneNumber}
                                        onChangeText={
                                            (text) => {
                                                const cleanedText = text.replace(/\s/g, '');
                                                setPhoneNumber(cleanedText);
                                            }
                                        }
                                        style={{ width: '90%', height: 50 }}
                                    />
                                </View>

                                {!isOtpSent &&
                                    <View style={{ borderColor: '#212529', borderWidth: 1, width: '90%', height: 50, paddingHorizontal: 10, borderRadius: 10, marginBottom: 15 }}>
                                        <TextInput
                                            placeholder="Entre le code de confirmation recu par SMS"
                                            value={otp}
                                            onChangeText={(text) => setOtp(text)}
                                            style={{ width: '90%', height: 50 }}
                                        />
                                    </View>
                                }

                                <View style={{ width: "100%", paddingHorizontal: 20, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    {isOtpSent ? (
                                        <TouchableOpacity
                                            onPress={SendOTP}
                                            style={{
                                                backgroundColor: "#212529",
                                                padding: 10,
                                                borderRadius: 10,
                                                width: '30%'
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: "bold", textAlign: 'center' }}>Recevoir code</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={VerifyOTP}
                                            style={{
                                                backgroundColor: "#212529",
                                                padding: 10,
                                                borderRadius: 10,
                                                width: '30%'
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: "bold", textAlign: 'center' }}>Me Connecter</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    )
                }
                <DevelopedBy />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        borderRadius: 10,
        height: '100%',
        overflow: 'hidden',
    },
})

export default LoginScreen;