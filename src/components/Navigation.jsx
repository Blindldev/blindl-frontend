import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, HStack, useColorMode } from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';

const Navigation = () => {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <Box as="nav" p={4} bg={colorMode === 'light' ? 'white' : 'gray.800'} boxShadow="sm">
      <HStack spacing={4} justify="space-between" maxW="1200px" mx="auto">
        <HStack spacing={4}>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          {profile && (
            <>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Link to="/matches">
                <Button variant="ghost">Matches</Button>
              </Link>
            </>
          )}
        </HStack>
        <HStack spacing={4}>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>
          {profile && (
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Navigation; 