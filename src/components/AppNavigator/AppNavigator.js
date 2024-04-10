import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from '../../screens/LoginPage/LoginPage.js';
import Accounts from '../../screens/AccountsPage/AccountsPage.js';
import TransferPage from '../../screens/TransferPage/index.js';
import EditProfile from '../../screens/EditUserPage/index.js'
import UserAccount from '../../screens/UserAccount/index.js'
import HomePage from '../../screens/Home/index.js'
import RegisterPage from '../../screens/Register/index.js'
import HistoryPage from '../../screens/HistoryPage/index.js'

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Accounts" component={Accounts} />
      <Stack.Screen name="Transfer" component={TransferPage} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="User Account" component={UserAccount} />
      <Stack.Screen name="History" component={HistoryPage} />
    </Stack.Navigator>
  );
}

export default AppNavigator;