import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const Transfers = () => {
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [balanceValid, setBalanceValid] = useState('');
  const [message, setMessage] = useState('');
  let UserID2 = "660afe5d252908ef4e28e49a";
  const route = useRoute();
  const { userData } = route.params;

  const CompleteTransfer = async () => {
    console.log("here");
    let obj = { "UserID1": userData.ID, "UserID2": UserID2, "Money": transferAmount };
    let js = JSON.stringify(obj);
    try {
      const response = await fetch('http://192.168.1.217:5000/api/transferMoney', {
        method: 'POST', 
        body: js, 
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let txt = await response.text();
      let res = JSON.parse(txt);
      console.log(res);
    } catch (e) {
      setMessage(e.toString());
    }
  };

  const CheckTransferValidity = async () => {
    console.log("here2 " + userData.ID);
    let obj = { "AccountType":"Checking", "UserID": userData.ID };
    let js = JSON.stringify(obj);
    console.log(js);
    try {
      const response = await fetch('http://192.168.1.217:5000/api/checkBalance', {
        method: 'POST', 
        body: js, 
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      let txt = await response.text();
      let res = JSON.parse(txt);
      console.log(res.balance);
      if (transferAmount <= res.balance){
        setBalanceValid('True');
        console.log('valid');
        CompleteTransfer();
      } else {
        setBalanceValid('False')
        console.log('invalid');
      } 
    } catch (e) {
      setMessage(e.toString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.wb}>Transfers</Text>
      <Text style={styles.header}>Target</Text>
      <TextInput
        value={transferTarget}
        onChangeText={text => setTransferTarget(text)}
      />
      <Text >Amount: $</Text>
      <TextInput
        value={transferAmount}
        onChangeText={text => setTransferAmount(text)}
        keyboardType="numeric"
      />
      <CustomButton text="Send Money" onPress={(CheckTransferValidity)} />
      <Text style={styles.header}>Sent: ${transferAmount}</Text>
      <Text>To: {transferTarget}</Text>
      <Text>{balanceValid}</Text>
      {message ? <Text>{message}</Text> : null}
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
        fontSize: 18,
        marginTop: 20,
    },
    wb: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 0,
    }
});

export default Transfers;