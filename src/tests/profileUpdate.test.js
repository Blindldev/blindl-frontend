import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileProvider } from '../context/ProfileContext';
import EditFields from '../components/EditFields';
import { ChakraProvider } from '@chakra-ui/react';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      email: 'test@example.com',
      age: 30,
      location: 'New York',
      occupation: 'Software Engineer',
      smoking: 'sometimes'
    }),
  })
);

describe('Profile Update Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should update profile when form is submitted', async () => {
    render(
      <ChakraProvider>
        <ProfileProvider>
          <EditFields />
        </ProfileProvider>
      </ChakraProvider>
    );

    // Fill in the form
    const ageInput = screen.getByLabelText(/age/i);
    const locationInput = screen.getByLabelText(/location/i);
    const occupationInput = screen.getByLabelText(/occupation/i);
    const smokingSelect = screen.getByLabelText(/smoking/i);

    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(locationInput, { target: { value: 'New York' } });
    fireEvent.change(occupationInput, { target: { value: 'Software Engineer' } });
    fireEvent.change(smokingSelect, { target: { value: 'sometimes' } });

    // Submit the form
    const submitButton = screen.getByText(/update profile fields/i);
    fireEvent.click(submitButton);

    // Wait for the update to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3002/api/profiles/update',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: expect.any(String),
            profileData: expect.objectContaining({
              age: '30',
              location: 'New York',
              occupation: 'Software Engineer',
              smoking: 'sometimes'
            })
          })
        })
      );
    });
  });

  test('should handle update errors', async () => {
    // Mock a failed fetch
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve('User not found')
      })
    );

    render(
      <ChakraProvider>
        <ProfileProvider>
          <EditFields />
        </ProfileProvider>
      </ChakraProvider>
    );

    // Fill in the form
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: '30' } });

    // Submit the form
    const submitButton = screen.getByText(/update profile fields/i);
    fireEvent.click(submitButton);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error updating profile/i)).toBeInTheDocument();
    });
  });
}); 