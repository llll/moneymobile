import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function SidePanel() {
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const navigation = useNavigation();

  const togglePanel = () => {
    setIsPanelExpanded(!isPanelExpanded);
  };

  const doLogout = async () => {
    await AsyncStorage.removeItem('userData');
    navigation.navigate('LoginPage'); // Assuming 'Login' is the name of your login screen route
  };

  return (
    <View style={[styles.panel, {width: isPanelExpanded ? '75%' : 50}]}>
      <TouchableOpacity onPress={togglePanel} style={styles.logoContainer}>
        <Image source={require('../../screens/logo.png')} style={styles.logo} />
        {isPanelExpanded && <Text style={styles.panelText}>Money Master</Text>}
      </TouchableOpacity>

      {isPanelExpanded && (
        <View style={styles.navContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Transfer')}>
            <Text style={styles.navText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
            <Text style={styles.navText}>User Account</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPanelExpanded && (
        <TouchableOpacity onPress={doLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#008080',
    borderRightColor: 'gray',
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    justifyContent: 'space-between',
    transitionProperty: 'width',
    transitionDuration: '500ms',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  panelText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  navContainer: {
    paddingVertical: 10,
  },
  navText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    backgroundColor: '#E9AD03',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SidePanel;