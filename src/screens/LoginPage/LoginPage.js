import React, {useContext, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert,Image} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { AuthContext } from '../../../App.js';
const LoginPage = ({navigation}) => {
    const [userData, setUserData] = useState();
    const { getUserData, setIsLoggedIn } = useContext(AuthContext);
    const {control, handleSubmit} = useForm();

    const onSignInPressed = async (data) => {
        const lowerUsername = (data.Username).toLowerCase();
        try {
          console.log('Sending request with data:', data);

          const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username:lowerUsername,
                Password:data.Password,
            }),
          });
          const json = await response.json();

          console.log('Response:', json);

          if (response.ok) {
            console.log('Authentication successful', json);
            setUserData(json);
            const userDataWithUsername = {...json, Username: lowerUsername};
            setUserData(userDataWithUsername);
            // Save login response JSON to AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userDataWithUsername));
            await AsyncStorage.setItem('isLoggedIn', 'true');
            console.log("get "+ await AsyncStorage.getItem('userData'));
            getUserData();
          } else {
            if (response.status == 403){
                Alert.alert(
                    "Login Failed", // Title of the alert
                    "Please Verify Your Email", // Message
                    [
                        { text: "OK", onPress: () => navigation.navigate('EmailVer', {username:lowerUsername}) } // Button to dismiss the alert
                    ]
                );
            }
            else{
                Alert.alert(
                    "Login Failed", // Title of the alert
                    "Invalid username or password. Please try again.", // Message
                    [
                        { text: "OK" } // Button to dismiss the alert
                    ]
                );
                console.warn('Authentication failed', json.message);
            }
          }
        } catch (error) {
          console.error('Sign in error', error);
        }
    };
    
    return (
        <View style={styles.root}>
            <Image source={require('../logo.png')} style={styles.logo} />
            
            <Controller 
                control={control}
                name="Username"
                render={({field: {value, onChange, onBlur}}) => (
                    <TextInput 
                        value={value} 
                        onChangeText={onChange} 
                        onBlur={onBlur} 
                        placeholder={'Username'} 
                        style={styles.input}
                    />
                )}
            />
            
            <Controller 
                control={control}
                name="Password"
                render={({field: {value, onChange, onBlur}}) => (
                    <TextInput 
                        value={value} 
                        onChangeText={onChange} 
                        onBlur={onBlur} 
                        placeholder={'Password'} 
                        secureTextEntry
                        style={styles.input}
                    />
                )}
            />
            <CustomButton text="Forgot Password?" onPress={handleSubmit(() => navigation.navigate('ForgotPW'))} />
            <CustomButton text="Sign In" onPress={handleSubmit(onSignInPressed)} />
        </View>
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
        color: 'white'
    },
    logo: {
        width: 200,
        height: 200,
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

export default LoginPage;