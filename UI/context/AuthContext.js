import React, {useState, createContext} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    const login = () => {
        setUserToken("ioaidoa");
        setIsLoading(false);
    }

    const logout = () => {
        setUserToken(null);
        setIsLoading(false);
    }

    return(
        <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}