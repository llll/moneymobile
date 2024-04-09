import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './src/screens/LoginPage/LoginPage.js';
import Accounts from './src/screens/AccountsPage/AccountsPage.js';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/components/AppNavigator/AppNavigator.js';
import SidePanel from './src/components/SidePanel/SidePanel.js';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#008080',
  }
});
