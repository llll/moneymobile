import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Username, setUsername] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState([]);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const validatePassword = (value) => {
    const requirements = [];
    if (value.length < 8) {
      requirements.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(value)) {
      requirements.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      requirements.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(value)) {
      requirements.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(value)) {
      requirements.push('Password must contain at least one symbol');
    }
    setPasswordRequirements(requirements);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    setPasswordMatch(Password === value);
  };

  const doRegister = async () => {
    try {
      if (!FirstName || !LastName || !Username || !PhoneNumber || !Email || !Password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      const emailPattern = /.+@.+\..+/;
      if (!emailPattern.test(Email)) {
        throw new Error('Invalid email format');
      }

      const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
      if (!phonePattern.test(PhoneNumber)) {
        throw new Error('Invalid phone number format (XXX-XXX-XXXX)');
      }

      if (Password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (passwordRequirements.length > 0) {
        throw new Error('Password does not meet requirements');
      }

      const response = await fetch('http://192.168.1.217:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            FirstName,
            LastName,
            Username,
            PhoneNumber,
            Email,
            Password,
        }),
      });
      console.log(JSON.stringify({
        FirstName,
        LastName,
        Username,
        PhoneNumber,
        Email,
        Password,
      }));
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      await AsyncStorage.setItem('registrationSuccess', 'true');
      Alert.alert('Success', 'Registration successful', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={FirstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={LastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={Username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number (XXX-XXX-XXXX)"
        value={PhoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={Email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={Password}
        onChangeText={handlePasswordChange}
        style={styles.input}
        secureTextEntry
      />
      {passwordRequirements.length > 0 && (
        <View style={styles.requirementsList}>
          {passwordRequirements.map((requirement, index) => (
            <Text key={index} style={styles.requirementText}>{requirement}</Text>
          ))}
        </View>
      )}
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        style={styles.input}
        secureTextEntry
      />
      {!passwordMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
      <Button title="Register" onPress={doRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  requirementsList: {
    marginBottom: 10,
  },
  requirementText: {
    color: 'red',
  },
  errorText: {
    marginBottom: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default Register;
