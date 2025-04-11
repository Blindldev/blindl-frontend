import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  useColorMode,
  IconButton,
  HStack,
  Heading,
  Container,
  Avatar,
  Badge,
  Flex,
  useToast,
  Grid,
  GridItem,
  Button,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { FaEdit, FaHeart, FaUser, FaMapMarkerAlt, FaVenusMars, FaSearch } from 'react-icons/fa';
import ProfileForm from './ProfileForm';
import BlurredProfiles from './BlurredProfiles';
import { useProfile } from '../context/ProfileContext';

const WaitingScreen = () => {
  const { colorMode } = useColorMode();
  const { profile, updateProfile } = useProfile();
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    updateProfile(updatedProfile);
    setIsProfileFormOpen(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" color="pink.500" />
        <Text mt={4} color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
          Loading your profile...
        </Text>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text fontSize="xl" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            No profile found
          </Text>
          <Button
            colorScheme="pink"
            onClick={() => setIsProfileFormOpen(true)}
          >
            Create Profile
          </Button>
        </VStack>
        <ProfileForm
          isOpen={isProfileFormOpen}
          onClose={() => setIsProfileFormOpen(false)}
          initialData={null}
          onProfileUpdate={handleProfileUpdate}
        />
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container maxW="container.xl" py={8}>
        <Grid
          templateColumns={{ base: '1fr', lg: '300px 1fr' }}
          gap={8}
          height="calc(100vh - 64px)"
        >
          {/* Left Sidebar - Profile Section */}
          <GridItem>
            <Box
              position="sticky"
              top="24px"
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              p={6}
              boxShadow="xl"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            >
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                  <Avatar
                    size="2xl"
                    name={profile.name}
                    src={profile.photoUrl}
                    icon={<FaUser />}
                    bg={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                    borderWidth="4px"
                    borderColor={colorMode === 'light' ? 'blue.200' : 'blue.700'}
                  />
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="pink"
                    variant="ghost"
                    onClick={() => setIsProfileFormOpen(true)}
                    aria-label="Edit Profile"
                    size="lg"
                  />
                </Flex>

                <VStack spacing={2} align="stretch">
                  <Heading size="xl" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                    {profile.name}, {profile.age}
                  </Heading>
                  <HStack spacing={2}>
                    <FaMapMarkerAlt color={colorMode === 'light' ? '#718096' : '#A0AEC0'} />
                    <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                      {profile.location}
                    </Text>
                  </HStack>
                </VStack>

                <Divider />

                <VStack spacing={4} align="stretch">
                  <HStack spacing={2}>
                    <FaVenusMars color={colorMode === 'light' ? '#718096' : '#A0AEC0'} />
                    <Badge colorScheme="purple" variant="subtle" fontSize="md" px={3} py={1}>
                      {profile.gender}
                    </Badge>
                  </HStack>
                  <HStack spacing={2}>
                    <FaSearch color={colorMode === 'light' ? '#718096' : '#A0AEC0'} />
                    <Badge colorScheme="green" variant="subtle" fontSize="md" px={3} py={1}>
                      {profile.lookingFor}
                    </Badge>
                  </HStack>
                </VStack>

                <Divider />

                <VStack spacing={4} align="stretch">
                  <Heading size="sm" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                    About Me
                  </Heading>
                  <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    {profile.bio}
                  </Text>
                </VStack>

                {profile.personality && (
                  <>
                    <Divider />
                    <VStack spacing={4} align="stretch">
                      <Heading size="sm" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                        Personality Profile
                      </Heading>
                      {Object.entries(profile.personality).map(([key, value]) => (
                        <HStack key={key} justify="space-between">
                          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </Text>
                          <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                            {value}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </>
                )}
              </VStack>
            </Box>
          </GridItem>

          {/* Right Content - Matches Section */}
          <GridItem>
            <Box
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              borderRadius="2xl"
              p={6}
              boxShadow="xl"
              borderWidth="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              height="100%"
              overflow="auto"
            >
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                    Your Matches
                  </Heading>
                  <Button
                    leftIcon={<FaHeart />}
                    colorScheme="pink"
                    variant="solid"
                    size="lg"
                    borderRadius="full"
                  >
                    See All Matches
                  </Button>
                </HStack>

                <BlurredProfiles />
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>

      <ProfileForm
        isOpen={isProfileFormOpen}
        onClose={() => setIsProfileFormOpen(false)}
        initialData={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </Box>
  );
};

export default WaitingScreen;