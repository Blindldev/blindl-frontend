import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { API_URL } from '../config';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRandomTestProfile = () => {
    const testEmails = [
      'alex.thompson@example.com',
      'sarah.chen@example.com',
      'marcus.johnson@example.com'
    ];
    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)];
    setFormData({
      email: randomEmail,
      password: 'test123',
      confirmPassword: ''
    });
    setIsNewAccount(false);
    toast({
      title: 'Test Profile Loaded',
      description: `Loaded profile for ${randomEmail.split('@')[0].replace('.', ' ')}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        setIsNewAccount(true);
        localStorage.setItem('isNewAccount', 'true');
        localStorage.setItem('newAccountEmail', formData.email);
        navigate('/');
      } else if (response.ok) {
        setProfile(data);
        
        const isTestProfile = formData.email.endsWith('@example.com');
        if (isTestProfile) {
          navigate('/waiting');
        } else {
          localStorage.setItem('isNewAccount', 'true');
          localStorage.setItem('newAccountEmail', formData.email);
          navigate('/profile');
        }

        toast({
          title: 'Success!',
          description: 'You have successfully signed in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'Failed to sign in');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={6}>
        <Heading>{isNewAccount ? 'Create Account' : 'Sign In'}</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isNewAccount || isLoading}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </FormControl>
            {isNewAccount && (
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </FormControl>
            )}
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="100%"
              isLoading={isLoading}
              loadingText={isNewAccount ? 'Creating Account...' : 'Signing in...'}
            >
              {isNewAccount ? 'Create Account' : 'Sign In'}
            </Button>
          </VStack>
        </form>
        <HStack spacing={4} width="100%">
          <Button
            variant="outline"
            colorScheme="green"
            onClick={loadRandomTestProfile}
            flex={1}
            isDisabled={isNewAccount || isLoading}
          >
            Load Test Profile
          </Button>
          <Button
            variant="outline"
            colorScheme="purple"
            onClick={() => {
              setIsNewAccount(true);
              setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
              }));
            }}
            flex={1}
            isDisabled={isNewAccount || isLoading}
          >
            Create Account
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SignIn; 