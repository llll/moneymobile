import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './src/screens/LoginPage/LoginPage.js';
import Accounts from './src/screens/AccountsPage/AccountsPage.js';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/components/AppNavigator/AppNavigator.js';
import SidePanel from './src/components/SidePanel/SidePanel.js';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from './src/screens/Home/Home.js';
import RegisterPage from './src/screens/Register/Register.js';
import TransferPage from './src/screens/TransferPage/TransferPage.js';
import EditProfile from './src/screens/EditUserPage/EditUserPage.js';
import UserAccount from './src/screens/UserAccount/UserAccount.js';
import Logout from './src/components/Logout/Logout.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useState, useEffect } from 'react';
import Transactions from './src/screens/Transactions/Transactions.js';
import EmailVer from './src/screens/EmailVeri/Email.js';
import ForgotPW from './src/screens/ForgotPW/ForgotPW.js';


const AuthStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export const AuthContext = createContext();
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Home" component={HomePage} />
    <AuthStack.Screen name="Login" component={LoginPage} />
    <AuthStack.Screen name="Register" component={RegisterPage} />
    <AuthStack.Screen name="EmailVer" component={EmailVer} />
    <AuthStack.Screen name="ForgotPW" component={ForgotPW} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <Drawer.Navigator>
    {/* Only include screens accessible after login */}
    <Drawer.Screen name="Accounts" component={Accounts} />
    <Drawer.Screen name="Transactions" component={Transactions} />
    <Drawer.Screen name="Transfer" component={TransferPage} />
    <Drawer.Screen name="User Account" component={UserAccount} />
    <Drawer.Screen name="Edit Profile" component={EditProfile} options={{ drawerLabel: () => null, title: null, drawerItemStyle: { height: 0 } }}/>
    <Drawer.Screen name="Logout" component={Logout} />
    {/* Other screens */}
  </Drawer.Navigator>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUserData = async () => {
    try {
      const isLoggedInValue = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(isLoggedInValue === 'true');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Provide getUserData and any other necessary state to the context
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, getUserData }}>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
      flex: 1,
      backgroundColor: '#008080',
      alignItems: 'center',
      padding: 20,
  },
  titleText: {
      fontSize: 75,
      fontWeight: 'bold',
      fontFamily: 'Cochin',
      color: 'white'
  },
  input: {
      
      backgroundColor: 'white',
      width: '100%',
      marginVertical: 10,
      // Assuming you want some basic styling for TextInput
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
  },
});

export default App;