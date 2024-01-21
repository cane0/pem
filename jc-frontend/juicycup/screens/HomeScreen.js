import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, StatusBar } from 'react-native';
import ApiJuiceList from '../components/items/ApiJuiceList';

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.screen}>
            <ApiJuiceList />
            <StatusBar
                backgroundColor="#212529"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
        // backgroundColor: 'rgba(255, 187, 9, 0.05)'
    }
})

export default HomeScreen;