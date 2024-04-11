import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

function AccountHistory() {
    const isFocused = useIsFocused();
    const [transactions, setTransactions] = useState([]);
    const [userData, setUserData] = useState('');

    useEffect(() => {
        if (isFocused) {
            getUserData();
        }
    }, [isFocused]);

    const getUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            console.log("user data: " + userDataString);
            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUserData(userData); // Update state
                LoadHistory(userData, "C"); // Assuming "C" is the key you're interested in
            }
        } catch (error) {
            console.error(error);
        }
    };

    const LoadHistory = async (userData, key) => {
        let obj = { "SearchKey": key, "UserID": userData.ID };
        let js = JSON.stringify(obj);
        try {
            const response = await fetch(('https://moneymaster22-267f3a958fc3.herokuapp.com/api/searchTransactions'), {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let txt = await response.text();
            let res = JSON.parse(txt);
            console.log(res);
            setTransactions(res); // Use the response directly
        } catch (e) {
            console.log(e);
        }
    };

    const transactionItemStyle = (amount) => ({
        color: (amount?.startsWith('+') ? 'lightgreen' : 'red') || 'white', // Fallback to 'white' if amount is undefined
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Transaction History</Text>
            <ScrollView>
                {transactions.map((transaction, index) => (
                    <View key={index} style={styles.transactionItem}>
                        <Text style={styles.transactionText}>Account ID: {transaction.AccountID}</Text>
                        <Text style={styles.transactionText}>User ID: {transaction.UserID}</Text>
                        <Text style={[styles.transactionText, transactionItemStyle(transaction.TransactionAmount)]}>
                            Amount: {transaction.TransactionAmount}
                        </Text>
                        <Text style={styles.transactionText}>Type: {transaction.TransactionType}</Text>
                        <Text style={styles.transactionText}>Date: {transaction.Date || 'N/A'}</Text>
                        <Text style={styles.transactionText}>Time: {transaction.Time || 'N/A'}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        fontWeight: 'bold',
        color: "white",
        fontSize: 18,
        marginBottom: 20,
    },
    transactionItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        marginVertical: 8,
        borderRadius: 5,
    },
    transactionText: {
        color: "white",
        fontSize: 16,
        marginBottom: 4,
    },
});

export default AccountHistory;