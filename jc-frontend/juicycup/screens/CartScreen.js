import {
    View, Vibration, Text, StyleSheet,
    ImageBackground, ScrollView, Pressable,
    TouchableOpacity, FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import {
    AntDesign, MaterialIcons,
    MaterialCommunityIcons
} from '@expo/vector-icons';
import React, {
    useEffect, useState, useRef,
    useLayoutEffect, useMemo, useCallback
} from "react";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyModal from "../components/modal";
import { useAuth } from '../context/AuthContext';
import { useData } from "../context/DataContext";
import DevelopedBy, { API_BASE_URL } from "../context/constants";
import LoadingScreen from "./LoadingScreen";
import OrderSuccess from "./OrderSuccess";

const CartScreen = () => {
    const navigation = useNavigation();

    const { currentUser, login, findUser } = useAuth();

    const [juices, setJuices] = useState([]);
    const [csrftoken, setCsrftoken] = useState('');
    const { state, dispatch } = useData();
    const { selectedJuices } = state;
    const [totalPrice, setTotalPrice] = useState(0);
    const [emptyJuiceList, setEmptyJuiceList] = useState(Object.keys(selectedJuices).length === 0);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/get-csrf-token/`);
                const token = response.data.csrftoken;
                setCsrftoken(token);
            } catch (error) {
                console.error('Error retrieving CSRF token:', error);
            }
        };

        // Call the function to get CSRF token when the component mounts
        getCsrfToken();

        findUser();
    }, []);

    const placeOrder = async () => {
        try {
            if (selectedDates.length === 0) {
                console.error('Please select a delivery date.');
                return;
            }

            const userId = currentUser.user.id;

            const orderDate = selectedDates[0];

            const orderData = {
                date: orderDate,
                is_confirmed: true,
                user: userId,
                items: Object.values(selectedJuices).map((juice) => ({
                    item: juice.id,
                    quantity: juice.clickCount,
                })),
            };

            const response = await axios.post(`${API_BASE_URL}/api/orders/`, orderData, {
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                }
            });

            console.log(response.data);

            AsyncStorage.removeItem("selectedJuices");

            dispatch({ type: 'REMOVE_SELECTED_JUICES' });

            navigation.navigate('Success', { orderId: response.data["id"] });
            // navigation.navigate('Success');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const onSelectDate = () => { setIsModalVisible(true); };
    const onModalClose = () => { setIsModalVisible(false); };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/juices/`);
                setJuices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Loading the saved state when the component mounts
        loadSelectedJuices();
    }, []);

    const saveSelectedJuices = async () => {
        try {
            dispatch({
                type: 'UPDATE_SELECTED_JUICES',
                payload: selectedJuices,
            });
            await AsyncStorage.setItem('selectedJuices', JSON.stringify(selectedJuices));
        } catch (error) {
            console.error('Error saving selectedJuices', error);
        }
    };

    const handleAdd = (id, name, price, image) => {
        dispatch({
            type: 'UPDATE_SELECTED_JUICES',
            payload: {
                ...selectedJuices,
                [id]: { id, price, name, image, clickCount: (selectedJuices[id]?.clickCount || 0) + 1 },
            },
        });
    };

    const handleSubtract = (id, name, price, image) => {
        const updatedSelectedJuices = { ...selectedJuices };
        const updatedClickCount = (updatedSelectedJuices[id]?.clickCount || 0) - 1;

        if (updatedClickCount <= 0) {
            // If clickCount is zero or less, remove the item from the list
            delete updatedSelectedJuices[id];
        } else {
            // Update the clickCount (quantity of items selected)
            updatedSelectedJuices[id] = { id, price, name, image, clickCount: updatedClickCount };
        }

        // Save selectedJuices to AsyncStorage
        saveSelectedJuices(updatedSelectedJuices);

        // Update the global state
        dispatch({
            type: 'UPDATE_SELECTED_JUICES',
            payload: updatedSelectedJuices,
        });
    };

    const loadSelectedJuices = async () => {
        try {
            const storedSelectedJuices = await AsyncStorage.getItem('selectedJuices');
            if (storedSelectedJuices) {
                // setSelectedJuices(JSON.parse(storedSelectedJuices));
                dispatch({
                    type: 'UPDATE_SELECTED_JUICES',
                    payload: JSON.parse(storedSelectedJuices),
                });
            }
        } catch (error) {
            console.error('Error loading selectedJuices:', error);
        }
    };

    useEffect(() => {
        const calculateTotalPrice = () => {
            let total = 0;

            Object.values(selectedJuices).forEach((selectedJuice) => {
                total += selectedJuice.clickCount * parseInt(selectedJuice.price);
            });

            setTotalPrice(total);
        };

        saveSelectedJuices();
        calculateTotalPrice();
    }, [selectedJuices, juices]);

    useEffect(() => {
        setEmptyJuiceList(Object.keys(selectedJuices).length === 0);
    }, [selectedJuices]);

    const renderItem = (itemId) => {
        const selectedJuice = selectedJuices[itemId];
        const juiceData = juices.find((juice) => juice["id"] === parseInt(itemId));

        if (!juiceData || !selectedJuice) {
            return null;
        }

        const juiceId = itemId;
        const juiceImage = juiceData.image;
        const juiceName = juiceData.name;
        const juicePrice = juiceData.price;
        const juiceQuantity = selectedJuice.clickCount;
        const totalJuicePrice = parseInt(juicePrice) * juiceQuantity;
        // console.log(selectedJuice);
        return (
            <View key={itemId} style={[styles.elemPadding, styles.elemBox]}>
                <View style={styles.itemImageContainer}>
                    <ImageBackground source={{ uri: juiceImage }} style={styles.itemImage} resizeMode='contain' />
                </View>
                <View style={{ width: '30%', alignItems: 'center' }}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 17.5, textAlign: 'center' }}>
                        {juiceName}
                    </Text>
                </View>
                <View style={styles.addMorePlease}>
                    <Text style={{ fontWeight: 'bold' }}>{totalJuicePrice} F</Text>
                    <View style={styles.addMorePleaseButton}>
                        <TouchableOpacity style={{ paddingTop: 7.5, paddingBottom: 7.5, paddingLeft: 7.5, }} onPress={() => handleSubtract(juiceId, juiceName, juicePrice, juiceImage)}>
                            <AntDesign size={15} name="minus" color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ paddingTop: 7.5, paddingBottom: 7.5 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>{juiceQuantity}</Text>
                        </View>
                        <TouchableOpacity style={{ paddingTop: 7.5, paddingBottom: 7.5, paddingRight: 7.5, }} onPress={() => handleAdd(juiceId, juiceName, juicePrice, juiceImage)}>
                            <AntDesign size={15} name="plus" color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // console.log(selectedDates);
    const monthList = [
        'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai',
        'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre',
        'Novembre', 'Decembre'
    ];

    const daysOfWeek = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const double_the_string = (str) => {
        return str.length === 1 ? '0' + str : str;
    };

    const [calendarData, setCalendarData] = useState([]);

    const populateCalendar = (month, year) => {
        setSelectedPeriod(`${monthList[month]} ${year}`);
        const newCalendarData = [];

        const firstDayOfMonth = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDayOfMonth; i++) {
            newCalendarData.push({ empty: true });
        }

        for (let day = 1; day <= daysInMonth(month, year); day++) {
            const daynmonth = `${year}-${double_the_string(month + 1)}-${double_the_string(day)}`;
            newCalendarData.push({ daynmonth, day });
        }

        setCalendarData(newCalendarData);
    };

    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        populateCalendar(newMonth, newYear);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        populateCalendar(newMonth, newYear);
    };

    const handleCurrentMonth = () => {
        let month = new Date().getMonth();
        let year = new Date().getFullYear();

        setCurrentMonth(month);
        setCurrentYear(year);
        populateCalendar(month, year);
    };

    const updateSelectedDates = (daynmonth) => {
        const index = selectedDates.indexOf(daynmonth);

        if (index === -1) {
            setSelectedDates([daynmonth]);
        } else {
            setSelectedDates([]);
        }
    };

    const nextMonth = () => {
        handleNextMonth();
    };

    const getCurrentMonth = () => {
        handleCurrentMonth();
        onSelectDate();
    };

    const isDateInPast = (dateString) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        const selectedDate = new Date(dateString);

        return selectedDate < currentDate;
    };

    const renderCalendarItem = ({ item }) => {
        const daynmonth = item.daynmonth;
        return (

            <TouchableOpacity
                style={selectedDates.includes(daynmonth) ? styles.selectedDate : styles.calendarDate}
                onPress={() => updateSelectedDates(daynmonth)}
                disabled={isDateInPast(daynmonth)}
            >
                <Text
                    style={selectedDates.includes(daynmonth)
                        ? { color: "#fff", fontWeight: 'bold' }
                        : isDateInPast(daynmonth)
                            ? { color: "rgba(197, 197, 197, 0.85)" }
                            : { color: '#212529' }}
                >
                    {item.day}</Text>
            </TouchableOpacity>
        );
    };

    let content;

    const longText = 'Les commandes passées peuvent être annulées UNIQUEMENT avant la date de livraison. Les demandes d\'annulation à compter de la date de livraison seront traitées UNIQUEMENT si elles sont dues à des retards ou à un manque de qualité.';
    const [showFullText, setShowFullText] = useState(false);

    const toggleTextVisibility = () => {
        setShowFullText(!showFullText);
    };

    if (emptyJuiceList) {
        content = (
            <View style={styles.emptyCartBody}>
                <View style={styles.emptyCardMiddleBox}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                        Ton Panier est vide !!!
                    </Text>
                    <View style={{ borderRadius: 10, width: '100%', height: '60%', marginVertical: 20 }}>
                        <ImageBackground source={require('../assets/nothing.png')} style={styles.backgroundImage} resizeMode='contain' />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ backgroundColor: '#212529', padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ajouter des articles</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        content = (
            <ScrollView style={[styles.elemPadding]}>
                <View style={{ paddingTop: 20, alignItems: 'center', }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Mon Panier</Text>
                </View>
                <View style={[{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 30, }]}>
                    <TouchableOpacity onPress={getCurrentMonth} style={{ backgroundColor: '#212529', padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Choisir Date et Addresse de livraison</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20 }}>
                        {Object.keys(selectedJuices).map((itemId) => renderItem(itemId))}
                    </View>
                </View>

                <View style={{ marginTop: 20, marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20 }}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Détails de la facture
                            </Text>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name='person-pin' size={20} />
                                    <Text>Facture pour </Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17.5 }}>{currentUser.user.first_name} {currentUser.user.last_name}</Text>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name='location-pin' size={20} />
                                    <Text>Adresse</Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17.5 }}>Entrer une addresse</Text>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name='notes' size={20} />
                                    <Text>Sous total</Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17.5 }}>F {totalPrice}</Text>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='bike-fast' size={20} />
                                    <Text>Charges de Livraison</Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17.5 }}>F 150</Text>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name='shopping-bag' size={20} />
                                    <Text>Grand total</Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17.5 }}>F {totalPrice + 150}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 10, marginBottom: 35 }}>
                    <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20 }}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Politique d'annulation
                            </Text>
                            <TouchableOpacity onPress={toggleTextVisibility} style={{ marginVertical: 10, }}>
                                <Text style={{ letterSpacing: 1, lineHeight: 20 }}>
                                    {showFullText ? longText : `${longText.slice(0, 70)}...`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <MyModal
                    isVisible={isModalVisible}
                    onClose={onModalClose}
                    title={"Choisi une date de Livraison"}
                    children={<View style={styles.calendarBox}>
                        <View style={styles.monthArea}>
                            <Text style={styles.selectedPeriod}>{selectedPeriod}</Text>
                            <View style={styles.monthArrows}>
                                <TouchableOpacity onPress={handlePrevMonth} style={styles.space}>
                                    <Text>
                                        <MaterialIcons name='arrow-upward' size={20} color={"#fff"} />
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleNextMonth} style={styles.space}>
                                    <MaterialIcons name='arrow-downward' size={20} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.daysSection}>
                            {daysOfWeek.map(day => (
                                <View key={day} style={styles.spaceNoBg}>
                                    <Text style={{ color: '#212529' }}>{day}</Text>
                                </View>
                            ))}
                        </View>

                        <FlatList
                            data={calendarData}
                            keyExtractor={(item) => item.daynmonth || item.empty.toString()}
                            renderItem={renderCalendarItem}
                            numColumns={7}
                            columnWrapperStyle={styles.row}
                            ItemSeparatorComponent={<View style={{ height: 15 }}></View>} />
                        <View style={styles.actionSection}>
                            <View />
                            <TouchableOpacity style={{ display: 'flex', height: 45, backgroundColor: 'green', borderRadius: 10, borderWidth: 1, borderColor: '#fff', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={placeOrder}>
                                <Text style={[styles.small, { color: '#fff' }]}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>} />

                <DevelopedBy />

            </ScrollView>
        );
    }

    if (loading) {
        return <LoadingScreen />
    }

    return content;
}

const pageWidth = Dimensions.get("window").width

const styles = StyleSheet.create({

    elemPadding: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    itemImage: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },

    elemBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 100,
        backgroundColor: 'transparent'
    },

    itemImageContainer: {
        height: 80,
        width: 80,
        borderRadius: 15,
        backgroundColor: '#fff'
    },

    addMorePlease: {
        alignItems: 'center',
        gap: 7.5
    },

    addMorePleaseButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 7.5,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#212529',
    },

    backgroundImage: {
        flex: 1,
        borderRadius: 10,
        height: '100%',
        overflow: 'hidden',
    },


    calendarBox: {
        padding: 30,

    },
    monthArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedPeriod: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212529'
    },
    monthArrows: {
        flexDirection: 'row',
        gap: 15,
    },
    space: {
        height: 30,
        width: 30,
        backgroundColor: '#212529',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 2,
    },
    spaceNoBg: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    daysSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    calendarDate: {
        height: 25,
        width: 25,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    selectedDate: {
        height: 25,
        width: 25,
        backgroundColor: '#212529',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    actionSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    small: {
        // marginBottom: 5,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: (pageWidth - 8.2 * 25) / 7,
    },

    emptyCartBody: {
        backgroundColor: 'rgba(255, 187, 9, 0.15)',
        height: "100%",
        alignItems: 'center',
        paddingTop: 100
    },

    emptyCardMiddleBox: {
        height: pageWidth * 0.80,
        width: pageWidth * 0.85,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center'
    }
})

export default CartScreen;