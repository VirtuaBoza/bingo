import React, { useContext } from 'react';
import { AsyncStorage } from 'react-native';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const usernameKey = '@usernameKey';
  function getUsername() {
    return AsyncStorage.getItem(usernameKey);
  }

  function setUsername(username) {
    return AsyncStorage.setItem(usernameKey, username);
  }

  return (
    <AuthContext.Provider
      value={{
        getUsername,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
