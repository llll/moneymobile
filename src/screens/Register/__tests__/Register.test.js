import React from 'react';
import { render } from '@testing-library/react-native';
import Register from '../Register'; // Adjust this import path to your project structure

describe('Register Page', () => {
  it('should display the Register button', () => {
    const { getByText } = render(<Register />);
    
    // Assuming CustomButton displays the text prop as its children or accessible text
    const registerButton = getByText('Register');
    expect(registerButton).toBeTruthy();
  });
});