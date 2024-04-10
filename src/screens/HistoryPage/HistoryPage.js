import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AccountHistory() {
    const [transactions, setTransactions] = useState([]);
    let key = "C";
    let uid = "660ada17b519fd0339d106b3";

    useEffect(() => {
        const LoadHistory = async () => {
            let obj = { "SearchKey": key, "UserID": uid };
            let js = JSON.stringify(obj);
            try {
                const response = await fetch('http://74.80.242.149:5000/api/searchTransactions', {
                    method: 'POST',
                    body: js,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let txt = await response.text();
                let res = JSON.parse(txt);
                let transArray = res.map(obj => Object.values(obj));
                setTransactions(transArray);
            }
            catch (e) {
                console.log(e);
            }
        };
        LoadHistory();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>History</Text>
            <View>
                {transactions.map((item, index) => (
                    <Text style={styles.generic} key={index}>{item}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        paddingTop: 50,
        padding: 20,
    },
    header: {
        fontWeight: 'bold',
        color: "white",
        fontSize: 18,
        marginTop: 20,
    },
    generic: {
      color: "white",
    }
    //Add one for input
});

export default AccountHistory;