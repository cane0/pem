import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const client = axios.create({
    baseURL: API_BASE_URL
});

const initialState = {
    currentUser: null,
    loading: true,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                currentUser: action.payload,
                loading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                currentUser: null,
                loading: false,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = async () => {
        try {
            const response = await client.get("/api/user-info/");
            dispatch({ type: "SET_USER", payload: response.data });
        } catch (e) {
            dispatch({ type: "LOGOUT" })
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            dispatch({ type: "LOGOUT" });
        } catch (error) {
            console.error("Error clearing AsyncStorage:", error);
        }

        // findUser();
    }

    const findUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("currentUser");
            if (storedUser) {
                dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
            }
        } catch (e) {
            console.log("AsyncStorage error", e);
        }
    };

    useEffect(() => {
        findUser();
    }, []);

    useEffect(() => {
        if (state.currentUser) {
            AsyncStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        }
    }, [state.currentUser]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, findUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};