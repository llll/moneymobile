import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, Alert,StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Transfers = () => {
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [balanceValid, setBalanceValid] = useState('');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState('')
  const [switchForms, setForm] = useState(true);
  const [transferAccountType, setAccountType] = useState('1');
  const selectForm = () => {
    setForm(!switchForms)
  };
  const handleChange = (itemValue) => {
    setAccountType(itemValue);
    console.log(transferAccountType);
  };
  const options = [
    { value: '1', label: "From Checking, To Savings" },
    { value: '2', label: "From Savings, to Checking" }
  ];
  useEffect(() => {
    const getUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            console.log("user data" + userDataString);
            console.log(userData.ID);
            if (userDataString !== null) {
                const userData = JSON.parse(userDataString);
                setUserData(userData); // Update state
            }
        } catch (error) {
            // Error retrieving data
            console.error(error);
        }
    };
    getUserData();
  }, []);

  const CompleteTransfer = async () => {
    const lowerTarget = transferTarget.toLowerCase();
    console.log("here");
    let obj = { "UserID1": userData.ID, "Username": lowerTarget, "Money": transferAmount };
    let js = JSON.stringify(obj);
    try {
      const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/transferMoney', {
        method: 'POST', 
        body: js, 
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let txt = await response.text();
      let res = JSON.parse(txt);
      if (response.status == 500){
        Alert.alert('Transfer Error', res.message);
      }
      else{
        Alert.alert('Success!', "You Sent $"+transferAmount + " To "+transferTarget);
      }
    } catch (e) {
      setMessage(e.toString());
    }
  };

  const CheckTransferValidity = async () => {
    if (transferAmount > 0){
      console.log("here2 " + userData.ID);
      let obj = { "AccountType":"Checking", "UserID": userData.ID };
      let js = JSON.stringify(obj);
      console.log(js);
      try {
        const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/checkBalance', {
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
          Alert.alert('Transfer Error', "You Do Not Have Enough Money In Your Checking Account");
          setBalanceValid('False')
          console.log('invalid');
        } 
      } catch (e) {
        setMessage(e.toString());
      }
    }
    else{
      Alert.alert('Transfer Error', "Please Enter an Amount > $0");
    }
  };

  const TransferUser = async () => {
    if (transferAmount > 0){
      if (transferAccountType == 1){
        console.log("here2 " + userData.ID);
        let obj = { "AccountType":"Checking", "UserID": userData.ID };
        let js = JSON.stringify(obj);
        console.log(js);
        try {
          const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/checkBalance', {
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
            let obj = JSON.stringify({ "UserID": userData.ID, "Type": transferAccountType, "Money": transferAmount });
            const res = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/transferMoneyAccount', {
              method: 'POST',
              body: obj,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log("test");
            if (res) {
                Alert.alert("Account Transfer Complete");
            }
          } else {
            Alert.alert('Transfer Error', "You Do Not Have Enough Money In Your Account");
            setBalanceValid('False')
            console.log('invalid');
          } 
        } catch (e) {
          setMessage(e.toString());
        }
      }
      else if (transferAccountType == 2){
        console.log("here2 " + userData.ID);
        let obj = { "AccountType":"Savings", "UserID": userData.ID };
        let js = JSON.stringify(obj);
        console.log(js);
        try {
          const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/checkBalance', {
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
            let obj = JSON.stringify({ "UserID": userData.ID, "Type": transferAccountType, "Money": transferAmount });
            const res = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/transferMoneyAccount', {
              method: 'POST',
              body: obj,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log("test");
            if (res) {
                Alert.alert("Account Transfer Complete");
            }
          } else {
            Alert.alert('Transfer Error', "You Do Not Have Enough Money In Your Account");
            setBalanceValid('False')
            console.log('invalid');
          } 
        } catch (e) {
          setMessage(e.toString());
        }
      }
    }
    else{
      Alert.alert('Transfer Error', "Please Enter an Amount > $0");
    }
  };

  return (
    <View style={styles.container}>
    {switchForms ? (
    <View>
      <Text style={styles.wb}>Transfer Money to User</Text>
      <Text style={styles.header}>Target User:</Text>
      <TextInput style={styles.ip}
        value={transferTarget}
        onChangeText={text => setTransferTarget(text)}
      />
      <Text style={styles.header}>Amount:</Text>
      <TextInput style={styles.ip}
        value={transferAmount}
        onChangeText={text => setTransferAmount(text)}
        keyboardType="numeric"
      />
      <CustomButton text="Send Money" onPress={(CheckTransferValidity)} />
    </View>
    ) : (
      <View>
        <Text style={styles.wb}>Transfer Money Between Accounts</Text>
        <Picker
            selectedValue={transferAccountType}
            onValueChange={handleChange}
            style={styles.pickerContainer}
        >
            {options.map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value}/>
            ))}
        </Picker>
        <Text style={styles.header}>Amount:</Text>
        <TextInput
            value={transferAmount}
            onChangeText={setTransferAmount}
            keyboardType="numeric"
            style={styles.ip}
        />
        <CustomButton text="Send" onPress={TransferUser} />
      </View>
      )}
      <CustomButton text="Switch Transfer Type" onPress={selectForm} />
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
    },
    ip: {
      backgroundColor: 'white',
      width: '100%',

      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,

      paddingHorizontal:10,
      paddingVertical:10,
      marginVertical: 5,
    },
    pickerContainer: {
      borderWidth: 0,
      borderColor: 'white',
      borderRadius: 5,
      marginBottom: 5,
      width: '100%',
      backgroundColor: '#008080',
    },
    pick: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 5,
      width: '80%',
      backgroundColor: '#008080',
    },
});

export default Transfers;