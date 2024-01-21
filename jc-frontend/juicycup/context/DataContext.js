import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    selectedJuices: {},
};

const dataReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_SELECTED_JUICES':
            return { ...state, selectedJuices: action.payload };
        case 'REMOVE_SELECTED_JUICES':
            return { ...state, selectedJuices: {} }
        default:
            return state;
    }
};

const resetSelectedJuices = () => ({ type: 'REMOVE_SELECTED_JUICES' });

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    return (
        <DataContext.Provider value={{ state, dispatch, resetSelectedJuices }}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export { DataProvider, useData };
