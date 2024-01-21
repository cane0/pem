import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStack } from './navigation/stack';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { useKeepAwake } from 'expo-keep-awake';

const App = () => {
  useKeepAwake();
  return (
    <AuthProvider>
      <DataProvider>
        <NavigationContainer>
          <HomeStack />
        </NavigationContainer>
      </DataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;