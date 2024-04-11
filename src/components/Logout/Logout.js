import React, { useContext,useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App.js';

const LogoutComponent = ({ navigation }) => {
  const { getUserData, setIsLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    const performLogout = async () => {
      await AsyncStorage.clear(); // Clearing AsyncStorage
      getUserData();
    };

    performLogout();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LogoutComponent;