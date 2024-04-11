import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert, Image} from 'react-native';
import CustomButton from '../../components/CustomButton';
import {useForm, Controller} from 'react-hook-form';

const Home = ({navigation}) => {
    
    
    return (
        <View style={styles.root}>
            <Image source={require('../logo.png')} style={styles.logo} />
            <Text style={styles.titleText}>Money</Text>
            <Text style={styles.titleText}>Master</Text>
            <CustomButton testID="loginButton" text="Login" onPress={() => navigation.navigate('Login')} />
            <CustomButton testID="registerButton" text="Register" onPress={() => navigation.navigate('Register')} />
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

export default Home;