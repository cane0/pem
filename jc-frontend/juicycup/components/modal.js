import {
    Modal, View, Text,
    Pressable,
    StyleSheet,
} from "react-native";
import { FontAwesome, FontAwesome5, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";

const MyModal = ({ isVisible, children, onClose, title, height, curve, icon }) => {

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            collapsable={false}
            onRequestClose={onClose}
        >
            <View style={{ height: "100%", backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Pressable onPress={onClose} style={styles.modalUpper} />
                <View style={{
                    height: height,
                    width: '100%',
                    backgroundColor: '#F0F8FF',
                    borderTopRightRadius: curve,
                    borderTopLeftRadius: curve,
                    position: 'absolute',
                    bottom: 0,
                }}>
                    <View style={{
                        height: 50,
                        backgroundColor: '#212529',
                        borderTopRightRadius: curve,
                        borderTopLeftRadius: curve,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{ flexDirection: "row", gap: 7.5, alignItems: "center" }}>
                            {icon}
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name='close' color={"#fff"} size={22} />
                        </Pressable>
                    </View>
                    {children}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalUpper: {
        height: "25%",
        width: "100%",
        top: 0,
        backgroundColor: "transparent",
    },

    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
        paddingVertical: 20,
    },
})

export default MyModal;