import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginPage from '../../screens/LoginPage/LoginPage.js';
import Accounts from '../../screens/AccountsPage/AccountsPage.js';
import TransferPage from '../../screens/TransferPage/index.js';
import EditProfile from '../../screens/EditUserPage/index.js'
import UserAccount from '../../screens/UserAccount/index.js'
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../../components/AppNavigator/AppNavigator.js';
// Add any other imports you need

const Drawer = createDrawerNavigator();

function RootNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Login" component={LoginPage} />
        {/* You can add more screens or drawer items here */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;