import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


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
            const response = await fetch('http://192.168.1.217:5000/api/searchUsers', {
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
            if (data.length > 0) {
                const user = data[0];
                setPhoneNumber(user.PhoneNumber);
                setEmail(user.Email);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSave = async () => {
        try {
            // Update logic here, similar to fetchUserData
            // Assuming you update the user data in an API

            // After updating, save updated user data locally
            const response = await fetch('http://192.168.1.217:5000/api/updateUser', {
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
                    <TextInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        style={styles.input}
                    />
                    <TextInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        style={styles.input}
                    />
                    <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <Button title="Save" onPress={handleSave} />
                    <Button title="Cancel" onPress={handleCancel} color="#CCCCCC" />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
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
});

export default EditProfile;