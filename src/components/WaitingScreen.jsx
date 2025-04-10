import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  useColorMode,
  HStack,
  Divider,
  Badge,
  useDisclosure,
  Container,
  useToast,
  Avatar,
  IconButton,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import BlurredProfiles from './BlurredProfiles';
import { FaEdit, FaSignOutAlt, FaUser } from 'react-icons/fa';
import ProfileForm from './ProfileForm';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/');
      return;
    }
  }, [profile, navigate]);

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
    navigate('/');
  };

  const handleProfileUpdate = async (updatedProfile) => {
    setIsLoading(true);
    try {
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8}>
          <Flex justify="space-between" width="100%" align="center">
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={profile.name}
                icon={<FaUser />}
                bg={colorMode === 'light' ? 'blue.500' : 'blue.300'}
              />
              <VStack align="start" spacing={0}>
                <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                  Welcome, {profile.name || 'Friend'}!
                </Heading>
                <Text color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                  {profile.location}
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Edit Profile">
                <IconButton
                  icon={<FaEdit />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={onOpen}
                  isLoading={isLoading}
                  aria-label="Edit Profile"
                />
              </Tooltip>
              <Tooltip label="Logout">
                <IconButton
                  icon={<FaSignOutAlt />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={handleLogout}
                  aria-label="Logout"
                />
              </Tooltip>
            </HStack>
          </Flex>

          <Box
            p={8}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="lg"
            width="100%"
          >
            <VStack spacing={6} align="stretch">
              <Box
                p={6}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                      {profile.name}, {profile.age}
                    </Text>
                  </HStack>
                  
                  <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    {profile.bio}
                  </Text>
                  
                  <HStack spacing={2}>
                    <Badge colorScheme="purple" variant="subtle">{profile.gender}</Badge>
                    <Badge colorScheme="blue" variant="subtle">{profile.location}</Badge>
                    <Badge colorScheme="green" variant="subtle">{profile.lookingFor}</Badge>
                  </HStack>
                </VStack>
              </Box>

              <ProfileForm
                isOpen={isOpen}
                onClose={onClose}
                initialData={profile}
                onProfileUpdate={handleProfileUpdate}
              />

              <Divider />

              <BlurredProfiles />
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default WaitingScreen; 