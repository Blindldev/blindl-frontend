import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Divider,
  HStack,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email');
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { setProfile } = useProfile();

  // Responsive styles
  const containerWidth = useBreakpointValue({ base: '100%', md: 'md' });
  const padding = useBreakpointValue({ base: 4, md: 10 });
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'md' });
  const fontSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const redirectUri = isLocalhost 
          ? 'http://localhost:3000' 
          : window.location.origin;

        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'popup',
          redirect_uri: redirectUri
        });

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { 
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with'
          }
        );
      }
    };

    // Wait for Google script to load
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  const loadRandomTestProfile = () => {
    const testEmails = [
      'alex.thompson@example.com',
      'sarah.chen@example.com',
      'marcus.johnson@example.com'
    ];
    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)];
    setEmail(randomEmail);
    setPassword('test123');
    setStep('password');
    toast({
      title: 'Test Profile Loaded',
      description: `Loaded profile for ${randomEmail.split('@')[0].replace('.', ' ')}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleGoogleSignIn = async (response) => {
    try {
      setIsLoading(true);
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      const result = await fetch('http://localhost:3002/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!result.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await result.json();
      
      // Check if the user has completed their profile
      if (!data.name || !data.age || !data.gender || !data.location || !data.bio) {
        // Redirect to profile creation if profile is incomplete
        navigate('/create-profile', { state: { email: data.email } });
      } else {
        // If profile is complete, go to waiting screen
        setProfile(data);
        navigate('/waiting');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify email');
      }

      const data = await response.json();
      if (data.exists) {
        setStep('password');
        setIsNewUser(false);
      } else {
        setStep('password');
        setIsNewUser(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isNewUser && password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://localhost:3002/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setProfile(data.profile);

      if (data.isNewUser) {
        navigate('/create-profile', { state: { email } });
      } else {
        navigate('/waiting');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW={containerWidth} py={padding} px={padding}>
        <VStack spacing={8} w="100%">
          <Text fontSize={fontSize} fontWeight="bold" textAlign="center">
            Welcome to Blindl
          </Text>
          
          <div id="googleSignInButton"></div>

          <HStack width="100%" spacing={4}>
            <Divider />
            <Text fontSize="sm" color="gray.500">or</Text>
            <Divider />
          </HStack>

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    size={buttonSize}
                    fontSize={{ base: 'md', md: 'md' }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  size={buttonSize}
                  isLoading={isLoading}
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  onClick={loadRandomTestProfile}
                  width="100%"
                  size={buttonSize}
                  isDisabled={isLoading}
                >
                  Load Test Profile
                </Button>
              </VStack>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size={buttonSize}
                    fontSize={{ base: 'md', md: 'md' }}
                  />
                </FormControl>
                {isNewUser && (
                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      size={buttonSize}
                      fontSize={{ base: 'md', md: 'md' }}
                    />
                  </FormControl>
                )}
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  size={buttonSize}
                  isLoading={isLoading}
                >
                  {isNewUser ? 'Create Account' : 'Sign In'}
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SignIn; 