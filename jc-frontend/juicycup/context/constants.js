import { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Linking, Pressable, Text } from 'react-native';

const DevelopedBy = () => {
    const openLink = () => {
        Linking.openURL('https://cane0.github.io/res01.html').catch((err) => console.error('An error occurred while opening the link:', err));
    };

    return (
        <Pressable style={{ marginVertical: 50, alignItems: 'center' }} onPress={openLink}>
            <Text style={{ color: '#494949' }}>Developed by</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#007a5e', fontSize: 30, fontWeight: 'bold' }}>@ca</Text>
                <Text style={{ color: '#ce1126', fontSize: 30, fontWeight: 'bold' }}>ne_</Text>
                <Text style={{ color: '#fcd116', fontSize: 30, fontWeight: 'bold' }}>__0</Text>
            </View>
        </Pressable>
    )
}

const useCsrfToken = () => {
    const [csrftoken, setCsrftoken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/get-csrf-token/`);
                const token = response.data.csrftoken;
                setCsrftoken(token);
            } catch (error) {
                console.error('Error retrieving CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []); // The empty dependency array ensures the effect runs only once on component mount

    return csrftoken;
};

// export default useCsrfToken;
export default DevelopedBy;
// export const API_BASE_URL = 'https://146c-102-67-251-123.ngrok-free.app/';
export const API_BASE_URL = 'http://192.168.76.249:8000/';