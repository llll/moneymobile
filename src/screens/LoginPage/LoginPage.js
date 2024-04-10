import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginPage = ({navigation}) => {
    const [userData, setUserData] = useState();
    const {control, handleSubmit} = useForm();

    const onSignInPressed = async (data) => {
        try {
          console.log('Sending request with data:', data);

          const response = await fetch('http://74.80.242.149:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Username:data.Username,
                Password:data.Password,
            }),
          });
          const json = await response.json();

          console.log('Response:', json);

          if (response.ok) {
            console.log('Authentication successful', json);
            setUserData(json);
            const userDataWithUsername = {...json, Username: data.Username};
            setUserData(userDataWithUsername);
            // Save login response JSON to AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userDataWithUsername));
            console.log("get "+ await AsyncStorage.getItem('userData'));

            navigation.navigate('Accounts');
          } else {
            Alert.alert(
                "Login Failed", // Title of the alert
                "Invalid username or password. Please try again.", // Message
                [
                    { text: "OK" } // Button to dismiss the alert
                ]
            );
            console.warn('Authentication failed', json.message);
          }
        } catch (error) {
          console.error('Sign in error', error);
        }
    };
    
    return (
        <View style={styles.root}>
            <Text style={styles.titleText}>Money</Text>
            <Text style={styles.titleText}>Master</Text>
            
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

export default LoginPage;