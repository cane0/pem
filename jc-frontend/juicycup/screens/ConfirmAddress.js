import MapView, { Marker } from 'react-native-maps';
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from 'react';
import MyModal from '../components/modal';
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PanDragEvent } from 'react-native-maps';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ConfirmAddress = () => {
    route = useRoute();
    const { selectedLocationConfirmation } = route.params;

    const [isVisible, setIsVisible] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [place, setPlace] = useState('Maison');
    const [submitEnabled, isSubmitEnabled] = useState(false);

    const handlePlace = (myPlace) => {
        setPlace(myPlace);
    }

    const handleInstructionsChange = (inputText) => {
        const charCount = inputText.length
        if (charCount <= 100) {
            setInstructions(inputText);
        }
    };

    const onCloseModal = () => {
        setIsVisible(false)
    };

    const openModal = () => {
        setIsVisible(true);
    };

    const openModalButton = () => {
        if (!isVisible) {
            return (

                <TouchableOpacity
                    style={{
                        position: 'absolute', top: 50,
                        right: 20, zIndex: 1, backgroundColor: '#212529',
                        borderRadius: 10, padding: 10
                    }}
                    onPress={openModal}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Entrer mes infos</Text>
                </TouchableOpacity>
            );
        }

        return null;
    }

    useEffect(() => {
        setTimeout(() => {
            openModal();
        }, 500)
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            <MyModal
                title={String(selectedLocationConfirmation.city).toUpperCase()}
                isVisible={isVisible}
                onClose={onCloseModal}
                height={"85%"}
                curve={0}
                icon={<MaterialIcons name='add-location-alt' size={20} color={'#fff'} />}
                children={
                    <View>
                        <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                            <Text style={{ fontWeight: 'bold' }}>{selectedLocationConfirmation.full_name}</Text>
                            <View
                                style={{
                                    marginVertical: 25, padding: 15,
                                    borderWidth: 0.5, borderColor: 'rgb(255, 187, 9)',
                                    borderRadius: 10, backgroundColor: 'rgba(255, 187, 9, 0.1)'
                                }}
                            >
                                <Text style={{ lineHeight: 24, fontWeight: '500', color: '#BD8800' }}>Une addresse detaillee nous permet de mieux nous retrouver a la livraison</Text>
                            </View>

                            <View style={{ gap: 25 }}>
                                <TextInput
                                    placeholder='Nº de Maison/Batiment/Signe distinctif (Requis)'
                                    style={{
                                        borderWidth: 1, backgroundColor: '#fff', borderRadius: 10,
                                        borderColor: '#21252980', height: 50, paddingHorizontal: 10,
                                    }}
                                />

                                <TextInput
                                    placeholder='Nom de Route/Zone (Optionel)'
                                    style={{
                                        borderWidth: 1, backgroundColor: '#fff', borderRadius: 10,
                                        borderColor: '#21252980', height: 50, paddingHorizontal: 10,
                                    }}
                                />

                                <View style={{ gap: 5 }}>
                                    <Text>Directions pour arriver (Optionel):</Text>
                                    <View style={{ backgroundColor: '#fff', height: 150, borderWidth: 1, borderColor: '#21252980', borderRadius: 10, padding: 10 }}>
                                        <TextInput
                                            textAlignVertical='top'
                                            multiline={true}
                                            placeholder='exemple: Trouver le portail rouge et sonner.'
                                            style={{
                                                height: '90%',
                                            }}
                                            value={instructions}
                                            onChangeText={handleInstructionsChange}
                                            maxLength={200}
                                        />
                                        <Text style={{ fontSize: 11, fontWeight: '500', color: '#21252980' }}>{instructions.length}/200</Text>
                                    </View>
                                </View>

                                <View style={{ gap: 10 }}>
                                    <Text>LIEU (Requis)</Text>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <TouchableOpacity onPress={() => { handlePlace('Maison') }} style={{ flexDirection: 'row', borderWidth: 1, borderColor: place === 'Maison' ? '#212529' : '#21252980', paddingHorizontal: 10, paddingVertical: 5, gap: 10, borderRadius: 50, backgroundColor: place === 'Maison' ? '#212529' : '#fff' }}>
                                            <MaterialCommunityIcons name='home-variant' size={20} color={place === 'Maison' ? '#fff' : '#212529'} />
                                            <Text style={{ color: place === 'Maison' ? '#fff' : '#212529' }}>Maison</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => { handlePlace('Travail') }} style={{ flexDirection: 'row', borderWidth: 1, borderColor: place === 'Travail' ? '#212529' : '#21252980', paddingHorizontal: 10, paddingVertical: 5, gap: 10, borderRadius: 50, backgroundColor: place === 'Travail' ? '#212529' : '#fff' }}>
                                            <MaterialIcons name='work' size={20} color={place === 'Travail' ? '#fff' : '#212529'} />
                                            <Text style={{ color: place === 'Travail' ? '#fff' : '#212529' }}>Travail</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <TouchableOpacity onPress={() => { handlePlace('Famille et amis') }} style={{ flexDirection: 'row', borderWidth: 1, borderColor: place === 'Famille et amis' ? '#212529' : '#21252980', paddingHorizontal: 10, paddingVertical: 5, gap: 10, borderRadius: 50, backgroundColor: place === 'Famille et amis' ? '#212529' : '#fff' }}>
                                            <MaterialIcons name='people' size={20} color={place === 'Famille et amis' ? '#fff' : '#212529'} />
                                            <Text style={{ color: place === 'Famille et amis' ? '#fff' : '#212529' }}>Famille et amis</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => { handlePlace('Autres') }} style={{ flexDirection: 'row', borderWidth: 1, borderColor: place === 'Autres' ? '#212529' : '#21252980', paddingHorizontal: 10, paddingVertical: 5, gap: 10, borderRadius: 50, backgroundColor: place === 'Autres' ? '#212529' : '#fff' }}>
                                            <MaterialIcons name='location-on' size={20} color={place === 'Autres' ? '#fff' : '#212529'} />
                                            <Text style={{ color: place === 'Autres' ? '#fff' : '#212529' }}>Autres</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>

                            <View style={{ height: 200 }} />

                        </ScrollView>
                        <View
                            style={{
                                position: 'absolute', width: '100%',
                                bottom: 0, borderTopLeftRadius: 20,
                                borderTopRightRadius: 20, height: 150,
                                backgroundColor: 'white', padding: 20,
                                // borderWidth: 1, borderColor: '#21252980',
                                alignItems: 'center', paddingBottom: 10,
                                shadowColor: '#212529', shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.8, shadowRadius: 1,
                                elevation: 5,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: "100%", backgroundColor: 'rgba(255, 187, 9, 0.5)',
                                    borderRadius: 20, padding: 20,
                                    alignItems: 'center'
                                }}
                                disabled={true}
                            >
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>ENREGISTRER MON ADDRESSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
            <MapView
                style={{ flex: 1 }}
                region={{
                    latitude: selectedLocationConfirmation.latitude,
                    longitude: selectedLocationConfirmation.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.002,
                }} // Handle map press to set a new location
            >
                <Marker
                    coordinate={{
                        latitude: selectedLocationConfirmation.latitude,
                        longitude: selectedLocationConfirmation.longitude,
                    }}
                    title={selectedLocationConfirmation.city}
                    description={`${selectedLocationConfirmation.latitude}, ${selectedLocationConfirmation.longitude}`} // Event handler for marker drag end
                />
            </MapView>
            {openModalButton()}
        </View>
    )
}

export default ConfirmAddress;