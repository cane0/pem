import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { View, Text, ScrollView, StyleSheet, ImageBackground, Pressable } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../context/constants";
import {
    FontAwesome, FontAwesome5, AntDesign,
    MaterialIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import DevelopedBy from "../context/constants"
import LoadingScreen from "./LoadingScreen";

const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split('-');
    const formattedDate = new Date(year, month - 1, day);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    return formattedDate.toLocaleDateString('en-US', options);
}

const OrderHistory = () => {
    const navigation = useNavigation();

    const { currentUser, login, findUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        findUser();
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}api/orders/user_orders/?user_id=${currentUser.user.id}`
                );
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error)
            }
        };

        fetchData();
    }, [])

    const renderOrders = (order) => {
        const renderBoxes = () => {
            const numBoxesToRender = order.total_quantity < 4 ? order.total_quantity : 3;
            const boxes = [];

            for (let i = 0; i < numBoxesToRender; i++) {
                boxes.push(
                    <View key={i} style={{ width: 75, height: 75, borderRadius: 10, backgroundColor: "rgba(255, 187, 9, 0.15)", }}>
                        <ImageBackground style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }} source={{ uri: order['items'][i]['item_image_url'] }} />
                    </View>
                );
            }

            if (numBoxesToRender < 3) {
                boxes.push(
                    <View key={99} style={{ width: 75, height: 75, borderRadius: 10, backgroundColor: "rgba(255, 187, 9, 0.15)", alignItems: "center", justifyContent: "center" }}>
                        <MaterialIcons name="arrow-forward" color={"rgb(255, 187, 9)"} size={30} />
                    </View>
                );
            }

            return boxes;
        }
        return (
            <Pressable onPress={() => { navigation.navigate('Summary', { orderId: order.id }) }} style={[styles.orderCard]} key={order.id}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, alignItems: "center", borderBottomColor: '#21252980', borderBottomWidth: 0.5, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                        {
                            order.is_confirmed ? (
                                <View style={{ backgroundColor: '#E4FFE4', width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: "center" }}>
                                    <MaterialIcons name="check" color={'#008000'} size={20} />
                                </View>
                            ) : (
                                <View style={{ backgroundColor: "rgba(255, 187, 9, 0.15)", width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: "center" }}>
                                    <FontAwesome5 name="ellipsis-h" color={"rgb(255, 187, 9)"} size={20} />
                                </View>
                            )
                        }

                        <View>
                            <Text style={{ fontWeight: "bold" }}>{`${order.total_quantity}`} Articles</Text>
                            <Text style={{ fontSize: 12 }}>F {order.total_price} &nbsp;&bull;&nbsp; {formatDate(order.date)}</Text>
                        </View>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" size={15} />
                </View>

                <View style={{ flexDirection: 'row', gap: 10, }}>
                    {renderBoxes()}
                </View>
            </Pressable>
        );
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <ScrollView style={styles.body}>
            {orders.map(renderOrders)}

            <DevelopedBy />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        padding: 20,
    },
    orderCard: {
        marginVertical: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    }
})

export default OrderHistory;