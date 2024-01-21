import {
    Pressable, Text, View,
    TouchableOpacity, ScrollView,
    StyleSheet,
} from "react-native"
import {
    FontAwesome, FontAwesome5, AntDesign,
    MaterialIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";
import { useData } from "../context/DataContext";
import axios from "axios";
import DevelopedBy, { API_BASE_URL } from "../context/constants";

const ProfileScreen = () => {
    const { currentUser, findUser, logout } = useAuth();
    const { resetSelectedJuices } = useData();

    const navigation = useNavigation();

    const submitLogout = async () => {
        try {
            await logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            });
            resetSelectedJuices();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        findUser();
    }, [])

    const formatString = (uValue) => {
        const value = uValue.slice(4, -1);
        return value[0] + ' ' + value.slice(1).match(/.{1,2}/g).join(' ');
    }

    return (
        <ScrollView style={[styles.elemPadding, styles.bodyStyle, styles.bottomMargin]}>

            <View style={[styles.elems, styles.elemPadding2]}>
                <View style={styles.boxIcon}>
                    <FontAwesome name='mobile-phone' color={'#212529'} size={25} />
                </View>
                <Text style={styles.boxText}>{currentUser ? (`+225 ${formatString(currentUser.user.phone_number)}`) : ('No number')}</Text>
            </View>

            <View style={styles.longContainer}>
                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialCommunityIcons color={'#212529'} name='account-edit' size={25} />
                    </View>
                    <Text style={styles.boxText}>Modifier mes Informations</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </View>

            <View style={[styles.lineContainer]}>
                <View style={styles.line} />
                <Text style={styles.moreInfo}>Plus d'Infos</Text>
                <View style={styles.line} />
            </View>

            <TouchableOpacity onPress={() => { navigation.navigate('History') }} style={styles.longContainer}>
                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialIcons color={'#212529'} name='access-time' size={25} />
                    </View>
                    <Text style={styles.boxText}>Historique Commandes</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />

            </TouchableOpacity>

            <View style={styles.longContainer}>
                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialIcons color={'#212529'} name='my-location' size={25} />
                    </View>
                    <Text style={styles.boxText}>Mes Addresses</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </View>

            <Pressable onPress={() => { navigation.navigate('Trial') }} style={styles.longContainer}>
                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialIcons color={'#212529'} name='info-outline' size={25} />
                    </View>
                    <Text style={styles.boxText}>A Propos de Nous</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </Pressable>

            <View style={styles.longContainer}>

                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <FontAwesome5 name='wallet' size={25} />
                    </View>
                    <Text style={styles.boxText}>Mon Porte Monnaie</Text>
                </View>
                <MaterialIcons color={'#212529'} name='keyboard-arrow-right' size={17.5} />
            </View>

            <View style={styles.longContainer}>

                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialIcons color={'#212529'} name='lock-outline' size={25} />
                    </View>
                    <Text style={styles.boxText}>Confidentialité de mon compte</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </View>

            <View style={styles.longContainer}>

                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <MaterialCommunityIcons color={'#212529'} name='share-outline' size={25} />
                    </View>
                    <Text style={styles.boxText}>Partage l'application</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </View>

            <TouchableOpacity onPress={submitLogout} style={styles.longContainer}>
                <View style={[styles.elems, styles.elemPadding2]}>
                    <View style={styles.boxIcon}>
                        <FontAwesome5 color={'#212529'} name='walking' size={25} />
                    </View>
                    <Text style={styles.boxText}>Se Déconnecter</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={17.5} color={'#212529'} />
            </TouchableOpacity>


            <DevelopedBy />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    bodyStyle: {
        backgroundColor: '#fff',
    },
    longContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    elemPadding: {
        padding: 20,
    },
    elemPadding2: {
        paddingBottom: 20,
        paddingTop: 20
    },
    elems: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 35,
    },
    bottomMargin: {
        bottomMargin: 40,
    },
    boxText: {
        fontSize: 15
    },
    boxIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 187, 9, 0.15)',
        borderRadius: 20
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
    },
    line: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#2125294d',
    },
    moreInfo: {
        marginHorizontal: 10,
        color: '#21252980'
    }
})

export default ProfileScreen