import {
    View, Text, ScrollView, StyleSheet,
    TouchableOpacity, ImageBackground,
    Pressable, Animated,
} from "react-native";
import { Dimensions } from "react-native";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useData } from "../../context/DataContext";
import DevelopedBy, { API_BASE_URL } from "../../context/constants";
import LoadingScreen from "../../screens/LoadingScreen";

const windowWidth = Dimensions.get("window").width;
const imageHeight = (windowWidth / 2) - 10;

const ApiJuiceList = () => {
    // Navigation between screens
    const navigation = useNavigation();

    // Persistent data across pages using dispatch 
    const { state, dispatch } = useData();
    const { selectedJuices } = state;

    // Array to store juices from Django backend API
    const [juices, setJuices] = useState([]);

    // Variables for displaying user feedback on selected items
    const [totalNumItems, setTotalNumItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Variable used to iterate list of selected Items
    const [numItems, setNumItems] = useState(Object.keys(selectedJuices).length);

    // Set the bottom bar to visible once the number of items is atleast 1
    const [bottomBarVisible, setBottomBarVisible] = useState(numItems > 0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/juices/`);
                setJuices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        loadSelectedJuices();
    }, [])

    const saveSelectedJuices = async () => {
        try {
            dispatch({
                type: 'UPDATE_SELECTED_JUICES',
                payload: selectedJuices,
            })
            await AsyncStorage.setItem('selectedJuices', JSON.stringify(selectedJuices));
        } catch (error) {
            console.error('Error saving selectedJuices', error);
        }
    };

    const loadSelectedJuices = async () => {
        try {
            const storedSelectedJuices = await AsyncStorage.getItem('selectedJuices');
            if (storedSelectedJuices) {
                dispatch({
                    type: 'UPDATE_SELECTED_JUICES',
                    payload: JSON.parse(storedSelectedJuices),
                });
            }
        } catch (error) {
            console.error('Error loading selectedJuices:', error);
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
    }

    // Saving the updated list in local storage
    useEffect(() => {
        const updatedNumItems = Object.keys(selectedJuices).length;
        setNumItems(updatedNumItems);
        // const numItems = ;

        if (updatedNumItems > 0) {
            let sum = 0;
            let priceSum = 0
            Object.entries(selectedJuices).forEach(([key, value]) => {
                sum += value.clickCount || 0;
                priceSum += parseInt(value.price) * value.clickCount || 0;
                // console.log(value.name, value.price)
            });

            setTotalNumItems(sum);
            setTotalPrice(priceSum);
        } else {
            setTotalNumItems(0);
            setTotalPrice(0);
        }

        saveSelectedJuices();
    }, [selectedJuices]);

    const translateY = useRef(new Animated.Value(0)).current;

    const animateBottomBar = () => {
        if (numItems > 0) {
            // console.log('visible');
            setBottomBarVisible(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setBottomBarVisible(false);
            });
        }
    }

    useLayoutEffect(() => {
        animateBottomBar();
    }, [totalNumItems]);

    const handleLayout = () => {
        animateBottomBar();
    }

    const renderItem = (item) => {
        return (
            <View key={item.id} style={styles.gridItem}>

                <Pressable onPress={() => navigation.navigate('Profile')} style={styles.imageContainer}>
                    <ImageBackground source={{ uri: item.image }} style={styles.itemImage}>
                    </ImageBackground>
                </Pressable>
                <View style={{ padding: 10, }}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontWeight: "bold", fontSize: 15 }}>{item.name}</Text>
                    <View style={styles.itemInfo}>

                        <Text style={{ fontSize: 15 }}>F {item.price}</Text>
                        {selectedJuices[item.id] !== undefined ? (
                            <View style={styles.alreadyAddButton}>
                                <TouchableOpacity style={{ paddingTop: 7.5, paddingBottom: 7.5, paddingLeft: 7.5, }} onPress={() => handleSubtract(item.id, item.name, item.price, item.image)}>
                                    <AntDesign size={15} name="minus" color={'#fff'} />
                                </TouchableOpacity>
                                <View style={{ paddingTop: 7.5, paddingBottom: 7.5 }}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>{selectedJuices[item.id]['clickCount']}</Text>
                                </View>
                                <TouchableOpacity style={{ paddingTop: 7.5, paddingBottom: 7.5, paddingRight: 7.5, }} onPress={() => handleAdd(item.id, item.name, item.price, item.image)}>
                                    <AntDesign size={15} name="plus" color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Pressable onPress={() => handleAdd(item.id, item.name, item.price, item.image)} style={styles.addButton}>
                                <Text style={{ color: '#212529', fontSize: 15 }}>Ajouter</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        )
    }

    if (loading) {
        return <LoadingScreen />
    }


    return (
        <View onLayout={handleLayout}>
            <ScrollView
                style={{ paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ padding: 8, borderRadius: 10, marginBottom: 8 }}>
                    <ImageBackground source={require('../../assets/banner_yellow.png')} style={styles.backgroundImage} />
                </View>
                <View style={{ padding: 8 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Nos Jus</Text>
                </View>
                <View style={styles.gridContainer}>
                    {juices.map(renderItem)}
                </View>

                <DevelopedBy />
            </ScrollView>

            <Animated.View style={[styles.bottomBar, { transform: [{ translateY }] }]}>
                {bottomBarVisible &&
                    <Pressable onPress={() => navigation.navigate('Cart')} style={styles.pressableBottomBar}>
                        <View style={styles.articleInfoFlexSection}>
                            <View style={styles.cartIconBackground}>
                                <MaterialCommunityIcons name="cart-outline" color={'white'} size={20} />
                            </View>
                            <View>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{totalNumItems} Article(s)</Text>
                                <Text style={{ fontSize: 17.5, color: '#fff', fontWeight: 'bold' }}>F {totalPrice}</Text>
                            </View>
                        </View>
                        <View style={styles.viewCartSection}>
                            <Text style={{ fontSize: 20, color: "#fff", }}>Voir mon Panier</Text>
                            <MaterialIcons name="arrow-right" color={'white'} size={20} />
                        </View>
                        {/* <Text style={{ color: '#212529', fontSize: 15, fontWeight: "bold" }}>Sticky Bottom</Text> */}
                    </Pressable>
                }
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        borderRadius: 10,
        height: imageHeight,
        overflow: 'hidden'
    },
    imageContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "rgba(33, 37, 41, 0.3)",
        borderRadius: 10,
        height: '65%'
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        paddingRight: 10,
        paddingTop: 7.5,
        paddingBottom: 7.5,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    alreadyAddButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 7.5,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#212529',
    },
    itemImage: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8
    },
    staticContent: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
        padding: 10,
        height: 150,
    },
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: "center",
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 8,
    },
    gridItem: {
        width: "47.5%",
        height: 300,
        marginBottom: 15,
    },
    bottomBar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: 10,
        height: 88,
        width: "100%",
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    pressableBottomBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        backgroundColor: 'green',
        borderRadius: 8,
        width: "100%",
        padding: 15
    },
    cartIconBackground: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        width: 45,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 8
    },
    articleInfoFlexSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: "100%"
    },
    viewCartSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    }
})

export default ApiJuiceList;