import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DevelopedBy, { API_BASE_URL } from "../context/constants";
import {
    FontAwesome, FontAwesome5, AntDesign,
    MaterialIcons, MaterialCommunityIcons,
    Feather, Octicons
} from '@expo/vector-icons';
import LoadingScreen from "./LoadingScreen";
// import Clipboard from "@react-native-clipboard/clipboard";

const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split('-');
    const formattedDate = new Date(year, month - 1, day);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    return formattedDate.toLocaleDateString('fr-Fr', options);
}

const OrderSummary = () => {
    const route = useRoute();
    const { orderId } = route.params;
    const [items, setItems] = useState([]);
    const { currentUser, findUser } = useAuth();
    const [orderDate, setOrderDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [copiedText, setCopiedText] = useState('');

    const copyToClipboard = () => {
        Clipboard.setString('hello world');
    };

    // const fetchCopiedText = async () => {
    //     const text = await Clipboard.getString();
    //     setCopiedText(text);
    // };

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/orders/${orderId}/`,
            );
            setItems(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data', error)
        }
    };

    useEffect(() => {
        findUser();
        fetchData();
    }, []);

    useEffect(() => {
        if (items.date) {
            setOrderDate(formatDate(items.date));
        }
    }, [items])
    const renderItems = (item) => (
        <View key={item.id} style={[styles.elemPadding, styles.elemBox]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                <View style={styles.itemImageContainer}>
                    <ImageBackground source={{ uri: item.item_image_url }} style={styles.itemImage} resizeMode='contain' />
                </View>

                <View style={{ gap: 5 }}>
                    <Text style={{ fontWeight: '500' }}>{item.item_name}</Text>
                    <Text style={{ color: '#212529' }}>F{item.unit_price} x {item.quantity}</Text>
                </View>
            </View>


            <Text style={{ fontWeight: "bold" }}>F{item.total_price}</Text>
        </View>
    );

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <ScrollView style={styles.body}>
            <View style={{}}>
                <View style={{ gap: 2.5, marginBottom: 20 }}>
                    <Text style={{ fontSize: 18.5, fontWeight: "bold" }}>Récapitulatif de la commande</Text>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ color: '#21252980' }}>Commande du </Text>
                        <Text style={{ color: '#21252980', fontWeight: "bold" }}>{orderDate}</Text>
                    </View>

                    <TouchableOpacity style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                        <Text style={{ color: '#008000' }}>Télécharger la facture</Text>
                        <Feather name="download" color={'#008000'} size={13} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 15 }}>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontWeight: "bold" }}>{items.total_quantity} articles dans cette commande</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20, paddingVertical: 5 }}>
                        {Array.isArray(items.items) && items.items.length > 0
                            ? items.items.map(renderItems)
                            : <Text>No items available</Text>
                        }
                    </View>
                </View>

                <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20, marginBottom: 15 }}>
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontWeight: "bold" }}>Details de la facture</Text>

                        <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='notes' size={20} />
                                <Text>Sous Total</Text>
                            </View>
                            <Text>F{items.total_price}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name='bike-fast' size={20} />
                                <Text>Charges de Livraison</Text>
                            </View>
                            <Text>F150</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between" }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='shopping-bag' size={20} />
                                <Text style={{ fontWeight: "bold" }}>Grand total</Text>
                            </View>

                            <Text style={{ fontWeight: "bold" }}>F{items.total_price + 150}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ backgroundColor: 'rgba(255, 187, 9, 0.2)', borderRadius: 20 }}>
                    <View style={{ padding: 20, gap: 10 }}>
                        <Text style={{ fontWeight: "bold" }}>Details de la commande</Text>

                        <View style={{ marginTop: 10, gap: 5 }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome5 name='id-card' size={20} />
                                <Text>Identifiant Commande</Text>
                            </View>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome5 name='id-card' size={20} color={'rgba(255, 187, 9, 0)'} />
                                <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }}>
                                    <Text>00000{items.id}</Text>
                                    <TouchableOpacity>
                                        <Octicons name="copy" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 10, gap: 5 }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='payments' size={20} />
                                <Text>Paiement</Text>
                            </View>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='payments' size={20} color={'rgba(255, 187, 9, 0)'} />
                                <Text>Especes</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10, gap: 5 }}>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='location-pin' size={20} />
                                <Text>Livrer a</Text>
                            </View>
                            <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='location-pin' size={20} color={'rgba(255, 187, 9, 0)'} />
                                <Text>Addresse</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 50, padding: 10 }}>
                <Text>Besoin d'aide pour cette commande?</Text>
                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                    <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>

                        <View style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#EDEDED", borderRadius: 10 }}>
                            <MaterialIcons name="chat" color={'#494949'} size={20} />
                        </View>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>Discuter avec nous!</Text>
                            <Text style={{ fontSize: 12, color: '#494949' }}>De tout problème lié à votre commande</Text>
                        </View>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" color={'#494949'} />
                </TouchableOpacity>
            </View>

            <DevelopedBy />
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    body: {
        padding: 20,
        backgroundColor: '#fff'
    },
    elemPadding: {
        display: "flex",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    itemImage: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },

    itemImageContainer: {
        height: 80,
        width: 80,
        borderRadius: 15,
        backgroundColor: '#fff'
    },

    elemBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
})

export default OrderSummary;
