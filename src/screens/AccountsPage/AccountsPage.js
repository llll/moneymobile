import React, { useState,useEffect, useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useIsFocused } from '@react-navigation/native';

function Accounts({navigation}) {
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('');
    const [checkingName, setCheckingName] = useState('');
    const [checkingAmount, setCheckingAmount] = useState('');
    const [savingsName, setSavingsName] = useState('');
    const [savingsAmount, setSavingsAmount] = useState('');
    const [userData, setUserData] = useState('')
    const getUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            console.log("user data" + userDataString);
            console.log(userData.ID);
            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUserData(userData); // Update state
                loadAccounts(userData); // Pass userData to loadAccounts
            }
        } catch (error) {
            // Error retrieving data
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (isFocused) {
            getUserData();
        }
      }, [isFocused]);
    
    const loadAccounts = async (userData) => {
        if (!userData || !userData.ID) {
            console.log("UserData is null or ID is missing.");
            return;
        }
        let objC = { "SearchKey": "C", "UserID": userData.ID };
        let jsC = JSON.stringify(objC);
        try {
            const response = await fetch('http://74.80.242.149:5000/api/searchCheckingAccounts', {
                method: 'POST', body: jsC, headers: { 'Content-Type': 'application/json' }
            });
            let txt = await response.text();
            console.log(txt);
            let res = JSON.parse(txt);
            console.log(res);
            setMessage('Checking Account Found');
            setCheckingName(res[0].AccountName);
            setCheckingAmount(res[0].AccountValue);
        } catch (e) {
            setMessage(e.toString());
        }

        let objS = { "SearchKey": "S", "UserID": userData.ID };
        let jsS = JSON.stringify(objS);
        try {
            const response = await fetch('http://74.80.242.149:5000/api/searchSavingsAccounts', {
                method: 'POST', body: jsS, headers: { 'Content-Type': 'application/json' }
            });
            let txt = await response.text();
            console.log(txt);
            let res = JSON.parse(txt);
            console.log(res);
            setMessage('Savings Account Found');
            setSavingsName(res[0].AccountName);
            setSavingsAmount(res[0].AccountValue);
        } catch (e) {
            setMessage(e.toString());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.wb}>Welcome Back, {userData.FirstName}</Text>
            <Text style={styles.header}>Checking</Text>
            <View>
                <Text style={styles.generic}>Account Type: {checkingName}</Text>
                <Text style={styles.generic}>Amount: {checkingAmount}</Text>
            </View>
            <Text style={styles.header}>Savings</Text>
            <View>
                <Text style={styles.generic} >Account Type: {savingsName}</Text>
                <Text style={styles.generic}>Amount: {savingsAmount}</Text>
            </View>
            <CustomButton text="Transfer Money" onPress={() => navigation.navigate('Transfer',{ userData: userData })} />
            <CustomButton text="User Account" onPress={() => navigation.navigate('User Account',{ userData: userData })} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        paddingTop: 50,
        padding: 20,
    },
    header: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
    wb: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 0,
    },
    generic: {
        color: "white",

    }
});

export default Accounts;