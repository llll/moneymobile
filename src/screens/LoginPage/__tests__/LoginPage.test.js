import React from 'react';
import { render,fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../LoginPage'; // Adjust the import path according to your project structure
import { AuthContext } from '../../../../App'; // Adjust this import as well

describe('LoginPage', () => {
  it('should display the Sign In button', () => {
    const mockGetUserData = jest.fn();
    const mockSetIsLoggedIn = jest.fn();

    const mockAuthContext = {
      getUserData: mockGetUserData,
      setIsLoggedIn: mockSetIsLoggedIn,
      // Add other context values and functions as needed
    };

    const { getByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <LoginPage navigation={{ navigate: jest.fn() }} />
      </AuthContext.Provider>
    );

    // Now you can test for the "Sign In" button as before
    expect(getByText('Sign In')).toBeTruthy();
  });
});