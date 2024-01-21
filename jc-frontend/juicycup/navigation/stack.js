import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../auth/AuthPage';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistory from '../screens/OrderHistory';
import OrderSummary from '../screens/OrderSummary';
import Header from '../components/header';
import { TouchableOpacity, View } from 'react-native';
import {
    FontAwesome, FontAwesome5, AntDesign,
    MaterialIcons, MaterialCommunityIcons,
    Feather
} from '@expo/vector-icons';
import OrderSuccess from '../screens/OrderSuccess';
import LoadingScreen from '../screens/LoadingScreen';
import { StackActions } from '@react-navigation/native';
// import MapScreen from '../screens/Trial';
import GooglePlacesAutoCompleteComponent from '../screens/Trial';
import ConfirmAddress from '../screens/ConfirmAddress';

const Stack = createStackNavigator();

export const HomeStack = () => {
    const { currentUser, findUser } = useAuth();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                await findUser();
                setIsLoading(false);
            } catch (e) {
                console.error('Error checking user status', e);
                setIsLoading(false);
            }
        };

        checkUserStatus();
    }, [])

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#212529',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }}
        >

            {!currentUser && (
                <>
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name='Login'
                        component={LoginScreen}
                    />
                </>
            )}
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    // header: () => <Header />
                    headerTitle: () => <Header />,
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        backgroundColor: '#212529',
                        borderBottomWidth: 1,
                        height: 175,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                }}
            />
            <Stack.Screen
                name='Cart'
                component={CartScreen}
                options={{ headerTitle: 'Mon Panier' }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerTitle: 'Mon Profil' }}
            />
            <Stack.Screen
                name="History"
                component={OrderHistory}
                options={{ headerTitle: 'Mes Commandes' }}
            />
            <Stack.Screen
                name="Summary"
                component={OrderSummary}
                options={{
                    headerTitle: 'Ma Commande',
                }}
            />
            <Stack.Screen
                name="Success"
                component={OrderSuccess}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Trial"
                component={GooglePlacesAutoCompleteComponent}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Address"
                component={ConfirmAddress}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}
