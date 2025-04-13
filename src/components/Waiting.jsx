import React from 'react';
import { Box, Container, Text, Button, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const Waiting = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { profile, setProfile } = useProfile();

  const handleLogout = () => {
    setProfile(null);
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW="md" py={10} px={4}>
        <VStack spacing={8} w="100%">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Welcome to Blindl
          </Text>
          
          <Text fontSize="lg" textAlign="center">
            Your profile is being reviewed. We'll notify you when you have a match!
          </Text>

          <Button
            colorScheme="blue"
            onClick={handleLogout}
            width="100%"
            size="lg"
          >
            Logout
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Waiting; 