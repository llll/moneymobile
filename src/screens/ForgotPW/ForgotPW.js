import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';

function ForgotPw({ navigation }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const submitText = async () => {
    if (isValidEmailFormat(email)) {
      try {
        const responses = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/searchUsers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ SearchKey: email }),
        });

        const users = await responses.json();

        if (users.length > 0) {
          const emailResponse = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/forgotPasswordEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
          });

          const emailData = await emailResponse.json();
          if (emailResponse.ok) {
            Alert.alert("Success", "Verification email sent.");
            setMessage('Verification code has been sent to your email.');
          } else {
            Alert.alert("Error", "Failed to send verification email");
            setMessage('Failed to send verification code. Please try again later.');
          }
        } else {
          setMessage('No account found with that email. Please try again.');
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again later.");
        setMessage('An error occurred. Please try again later.');
      }
      setEmail('');
    } else {
      setMessage('Invalid email format. Please enter a valid email address.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Master</Text>
      <Text style={styles.subTitle}>Forgot Password</Text>
      <Text style={styles.description}>Enter your email, and we'll send you a verification code you can use to get back in your account.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <CustomButton
        text="Submit"
        onPress={submitText}
      />
      {message ? (
        <Text style={[styles.message, message.startsWith('No account') || message.startsWith('Invalid email') ? styles.error : styles.success]}>
          {message}
        </Text>
      ) : null}
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Register</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#008080',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#ffcccc',
    color: '#cc0000',
  },
  success: {
    backgroundColor: '#ccffcc',
    color: '#006600',
  },
  footerText: {
    color: 'white',
    marginTop: 16,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default ForgotPw;