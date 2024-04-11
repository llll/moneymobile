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
            const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/searchCheckingAccounts', {
                method: 'POST', body: jsC, headers: { 'Content-Type': 'application/json' }
            });
            let txt = await response.text();
            console.log("text " +txt);
            let res = JSON.parse(txt);
            console.log(txt.length);
            if (txt.length == 2){
                const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/createChecking', {
                method: 'POST', 
                body: JSON.stringify({UserID:userData.ID}), headers: { 'Content-Type': 'application/json' }
                });
                console.log(response.json)
                loadAccounts(userData);
            }
            setMessage('Checking Account Found');
            setCheckingName(res[0].AccountName);
            setCheckingAmount(res[0].AccountValue);
        } catch (e) {
            setMessage(e.toString());
        }

        let objS = { "SearchKey": "S", "UserID": userData.ID };
        let jsS = JSON.stringify(objS);
        try {
            const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/searchSavingsAccounts', {
                method: 'POST', body: jsS, headers: { 'Content-Type': 'application/json' }
            });
            let txt = await response.text();
            console.log(txt);
            let res = JSON.parse(txt);
            console.log(res);
            if (txt.length == 2){
                const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/createSavings', {
                method: 'POST', 
                body: JSON.stringify({UserID:userData.ID}), headers: { 'Content-Type': 'application/json' }
                });
                console.log(response.json)
                loadAccounts(userData);
            }
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
            <View style={styles.next}>
            <View style={styles.roundedBox}>
            <Text style={styles.header}>Checking Account</Text>
            <View>
                <Text style={styles.bal}>Balance: ${checkingAmount}</Text>
            </View>
            </View>
            </View>
            <View style={styles.next}>
            <View style={styles.roundedBox}>
            <Text style={styles.header}>Savings Account</Text>
            <View>
                <Text style={styles.bal}>Balance: ${savingsAmount}</Text>
            </View>
            </View>
            </View>
            <View style={styles.next}>
            <CustomButton text="View Transaction History" onPress={() => navigation.navigate('Transactions',{ userData: userData })} />
            <CustomButton text="Transfer Money" onPress={() => navigation.navigate('Transfer',{ userData: userData })} />
            <CustomButton text="User Account" onPress={() => navigation.navigate('User Account',{ userData: userData })} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        paddingTop: 30,
        padding: 20,
    },
    next: {
        backgroundColor: '#008080',
        paddingTop: 20,
        padding: 1,
    },
    header: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 16,
    },
    bal: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 5,
    },
    wb: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 0,
    },
    generic: {
        color: "white",

    },
    roundedBox: {
        width: "100%", // Set the width
        height: 90, // Set the height
        borderRadius: 20, // Apply border radius to create rounded corners
        borderWidth: 3, // Set border width
        borderColor: '#FFF', // Set border color
        justifyContent: 'left', // Center content vertically
        alignItems: 'center', // Center content horizontally
      },
});

export default Accounts;