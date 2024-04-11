import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton';
function EditProfile() {
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchStoredUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    const data = JSON.parse(storedUserData);
                    setUserData(data);
                    setFirstName(data.FirstName);
                    setLastName(data.LastName);
                    // Assuming you have a method to fetch phone number and email
                    fetchUserData(data.Username);
                }
            } catch (e) {
                setError('Failed to load user data.');
            }
        };

        fetchStoredUserData();
    }, []);

    const fetchUserData = async (username) => {
        try {
            const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/searchUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SearchKey: username }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            const exactMatch = data.find(user => user.Username === username);
            if (exactMatch) {
                setPhoneNumber(exactMatch.PhoneNumber);
                setEmail(exactMatch.Email);
            } else {
            // Handle the case where there is no exact match
            console.log('No exact match found');
            }
            console.log(exactMatch);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSave = async () => {
        try {
            // Update logic here, similar to fetchUserData
            // Assuming you update the user data in an API

            // After updating, save updated user data locally
            const response = await fetch('https://moneymaster22-267f3a958fc3.herokuapp.com/api/updateUser', {
                method: 'PUT', // Change method to PUT for updating user
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: userData.Username, // Add Username field to identify the user
                    FirstName: firstName,
                    LastName: lastName,
                    PhoneNumber: phoneNumber,
                    Email: email,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            const updatedUserData = { ...userData, FirstName: firstName, LastName: lastName, PhoneNumber: phoneNumber, Email: email };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
            console.log("updated: "+JSON.stringify(updatedUserData));
            Alert.alert('Success', 'Profile updated successfully');
            // Navigate or update UI accordingly
            navigation.navigate('Edit Profile');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancel = () => {
        // Go back or navigate to a specific screen
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            {userData && (
                <>
                <Text style={styles.header}>First Name</Text>
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        style={styles.inputs}
                    />
                    <Text style={styles.header}>Last Name</Text>
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        style={styles.inputs}
                    />
                    <Text style={styles.header}>Phone Number</Text>
                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        style={styles.inputs}
                    />
                    <Text style={styles.header}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        style={styles.inputs}
                    />
                    <CustomButton text="Save" onPress={handleSave} />
                    <CustomButton text="Cancel" onPress={handleCancel} color="#CCCCCC" />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#008080',
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 10,
        color:'white',
    },
    input: {
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    inputs: {
        backgroundColor: 'white',
        width: '100%',

        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal:10,
        paddingVertical:10,
        marginVertical: 5,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
    },
});

export default EditProfile;