import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using react-navigation
import { useIsFocused } from '@react-navigation/native';

function UserAccount() {
    const isFocused = useIsFocused();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        if (isFocused) {
            const checkEditSuccess = async () => {
                const editSuccessful = await AsyncStorage.getItem('editSuccess');
                if (editSuccessful) {
                    // Clear the AsyncStorage item once retrieved
                    await AsyncStorage.removeItem('editSuccess');
                    setSuccessMessage('Your changes have been saved successfully!');
                }
            };
    
            checkEditSuccess();
        }
      }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
        const fetchData = async () => {
            const storedUserData = JSON.parse(await AsyncStorage.getItem('userData'));
            if (storedUserData && storedUserData.Username) {
                try {
                    const response = await fetch('http://74.80.242.149:5000/api/searchUsers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ SearchKey: storedUserData.Username }),
                    });

                    if (!response.ok) {
                        throw new Error('Error fetching user data');
                    }

                    const data = await response.json();
                    setUserData(data[0]);
                } catch (error) {
                    setError('Error fetching user data');
                    console.error(error);
                }
            }
        };

        fetchData();
    }
    }, [isFocused]);

    const handleEditProfile = () => {
        navigation.navigate('Edit Profile'); // Use React Navigation instead of window.location.href
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {userData ? (
                    <View>
                        <Text style={styles.profileTitle}>Profile</Text>
                        {successMessage && (
                            <View style={styles.successMessage}>
                                <Text style={styles.successMessageText}>{successMessage}</Text>
                            </View>
                        )}
                        <View style={styles.userInitialsContainer}>
                            <Text style={styles.userInitials}>{userData.FirstName[0]}{userData.LastName[0]}</Text>
                            <View>
                                <Text style={styles.userName}>{userData.FirstName} {userData.LastName}</Text>
                                <Text style={styles.userDetail}>{userData.Username}</Text>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <Text style={styles.userDetail}>Phone: {userData.PhoneNumber}</Text>
                        <Text style={styles.userDetail}>Email: {userData.Email}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.userDetail}>{error ? error : 'Loading...'}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        padding: 20,
    },
    profileContainer: {
        flex: 1,
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF',
    },
    successMessage: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    successMessageText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    userInitialsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userInitials: {
        width: 40,
        height: 40,
        backgroundColor: '#CCCCCC',
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 18,
        marginRight: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    userDetail: {
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: '#008008',
        textAlign: 'center',
    },
});

export default UserAccount;