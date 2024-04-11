import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const VerificationPage = () => {
  const [code, setCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  useEffect(() => {
    // AsyncStorage is asynchronous
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  const handleCodeChange = (code) => {
    setCode(code);
  };

  const handleSubmit = async () => {
    setVerificationStatus('Verifying...');

    try {
      const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, EmailVerificationCode: code })
      });
      const data = await response.json();
      if (response.ok) {
        setVerificationStatus('Verification successful!');
        await AsyncStorage.setItem('verificationSuccess', 'true');
        navigation.navigate('Login'); // Assuming 'Account' is the route name in your navigation setup
      } else {
        setVerificationStatus(`Verification failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('An error occurred during verification.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../logo.png')} style={styles.logo} />
        <Text style={styles.title}>Money Master</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.header}>Enter Verification Code</Text>
        <Text style={styles.instructions}>Enter the 6-digit verification code we sent to your email.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="6-digit code"
          placeholderTextColor="#FFFFFF"
          value={code}
          onChangeText={handleCodeChange}
          maxLength={6}
          keyboardType="numeric"
        />
        
        <Button title="Verify" onPress={handleSubmit} color="black" />
        
        {verificationStatus ? (
          <Text style={verificationStatus.startsWith('Verification failed') ? styles.errorText : styles.successText}>
            {verificationStatus}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#008080',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructions: {
    color: '#FFFFFF',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    color: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
  },
  errorText: {
    marginTop: 10,
    color: '#d9534f',
    padding: 10,
    backgroundColor: '#f2dede',
    borderRadius: 5,
  },
  successText: {
    marginTop: 10,
    color: '#5cb85c',
    padding: 10,
    backgroundColor: '#dff0d8',
    borderRadius: 5,
  }
});

export default VerificationPage;