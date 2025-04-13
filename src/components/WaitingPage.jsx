import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';

const WaitingPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Responsive styles
  const containerWidth = useBreakpointValue({ base: '100%', md: 'md' });
  const padding = useBreakpointValue({ base: 4, md: 10 });
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'md' });
  const fontSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW={containerWidth} py={padding} px={padding}>
        <VStack spacing={8} w="100%">
          <Text fontSize={fontSize} fontWeight="bold" textAlign="center">
            Welcome to Simple Dating App
          </Text>

          <Text textAlign="center">
            We're working on finding your perfect match. In the meantime, you can:
          </Text>

          <VStack spacing={4} w="100%">
            <Button
              onClick={() => navigate('/edit-profile')}
              colorScheme="blue"
              width="100%"
              size={buttonSize}
            >
              Edit Profile Picture
            </Button>

            <Button
              onClick={() => navigate('/edit-fields')}
              colorScheme="teal"
              width="100%"
              size={buttonSize}
            >
              Edit Profile Information
            </Button>

            <Button
              onClick={() => navigate('/signin')}
              variant="outline"
              colorScheme="gray"
              width="100%"
              size={buttonSize}
            >
              Sign Out
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default WaitingPage; 