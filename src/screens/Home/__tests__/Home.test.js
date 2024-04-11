import React from 'react';
import { render,fireEvent,waitFor} from '@testing-library/react-native';
import Home from '../../Home/Home'; // Adjust the import path to match your file structure

// Mock the navigation prop
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('Home Screen', () => {
  it('should display the login button', () => {
    const { getByTestId } = render(<Home navigation={mockNavigation} />);

    // getByTestId will throw an error if it cannot find an element with the given testID
    expect(getByTestId('loginButton')).toBeTruthy();
  });
  it('should go to login on login', () => {
    const mockNavigate = jest.fn();
    const {getByTestId} = render(<Home navigation={{navigate: mockNavigate}} />);

    // Simulate pressing the login button
    fireEvent.press(getByTestId('loginButton'));

    // Expect the navigation function to have been called with 'Login'
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
  it('should display the register button', () => {
    const { getByTestId } = render(<Home navigation={mockNavigation} />);

    // getByTestId will throw an error if it cannot find an element with the given testID
    expect(getByTestId('registerButton')).toBeTruthy();
  });
  it('should go to register on register', () => {
    const mockNavigate = jest.fn();
    const {getByTestId} = render(<Home navigation={{navigate: mockNavigate}} />);

    // Simulate pressing the login button
    fireEvent.press(getByTestId('registerButton'));

    // Expect the navigation function to have been called with 'Login'
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});

