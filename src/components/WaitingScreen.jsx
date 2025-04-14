import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  Divider,
  Heading,
  IconButton,
  useColorMode,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Progress,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  useToast,
  useBreakpointValue,
  Image,
} from '@chakra-ui/react';
import { FaEdit, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaHeart, FaBrain } from 'react-icons/fa';
import ProfileForm from './ProfileForm';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';

const WaitingScreen = () => {
  const { colorMode } = useColorMode();
  const { profile, setProfile, updateProfile } = useProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const fontSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const padding = useBreakpointValue({ base: 4, md: 8 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Sample photos to cycle through
  const samplePhotos = [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg'
  ];

  useEffect(() => {
    // Only redirect if we're sure there's no profile after loading
    const checkProfile = async () => {
      try {
        // Wait a moment for the profile to be set in context
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!profile) {
          console.log('No profile found after loading, redirecting to sign in');
          navigate('/');
        } else {
          console.log('Profile found:', profile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        navigate('/');
      }
    };

    checkProfile();
  }, [profile, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % samplePhotos.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      console.log('Starting profile update with data:', updatedProfile);
      
      const response = await fetch('http://localhost:3002/api/profiles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          profileData: updatedProfile
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Profile update successful:', updatedUser);
      
      setProfile(updatedUser);
      setIsProfileModalOpen(false);
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    console.log('Logging out user');
    setProfile(null);
    navigate('/');
    toast({
      title: 'Logged out successfully',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    console.log('Loading profile...');
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize={fontSize}>Loading your profile...</Text>
        </VStack>
      </Box>
    );
  }

  if (!profile) {
    console.log('No profile found, redirecting to sign in');
    return (
      <Container centerContent py={10}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Profile Not Found</AlertTitle>
          <AlertDescription>Please sign in again or contact support.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  console.log('Rendering profile:', profile);
  return (
    <Box minH="100vh" bg="gray.50" py={padding} px={padding}>
      <VStack spacing={8} maxW="container.md" mx="auto">
        <HStack w="100%" justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            Your Profile
          </Text>
          <HStack>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </HStack>
        </HStack>
        
        <Box w="100%" bg="white" p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={6} align="start">
            <HStack spacing={4} align="start">
              <Avatar
                size="xl"
                src={profile.picture}
                name={profile.name}
              />
              <Box flex="1">
                <HStack justify="space-between" align="center">
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">{profile.name}</Text>
                    <Text color="gray.600">{profile.age} years old</Text>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="gray.500" />
                      <Text color="gray.600">{profile.location}</Text>
                    </HStack>
                    {profile.occupation && (
                      <HStack>
                        <Icon as={FaBriefcase} color="gray.500" />
                        <Text color="gray.600">{profile.occupation}</Text>
                      </HStack>
                    )}
                    {profile.education && (
                      <HStack>
                        <Icon as={FaGraduationCap} color="gray.500" />
                        <Text color="gray.600">{profile.education}</Text>
                      </HStack>
                    )}
                  </Box>
                  <VStack align="center">
                    <IconButton
                      aria-label="Edit profile"
                      icon={<FaEdit />}
                      onClick={() => setIsProfileModalOpen(true)}
                      colorScheme="blue"
                      size="lg"
                    />
                    <Text fontSize="sm" color="gray.500">Edit Profile Information</Text>
                  </VStack>
                </HStack>
              </Box>
            </HStack>
              
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Heading size="lg" mb={4}>Finding you a good match...</Heading>
                <Text color="gray.500" mb={6}>
                  We're searching through our database to find someone who shares your interests and values.
                </Text>
                
                {/* Cycling blurred photos */}
                <Box position="relative" height="300px" mb={8}>
                  <Image
                    src={samplePhotos[currentPhotoIndex]}
                    alt="Potential match"
                    boxSize="300px"
                    objectFit="cover"
                    borderRadius="full"
                    filter="blur(8px)"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    opacity={0.7}
                    transition="opacity 0.5s ease-in-out"
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>About Me</Heading>
                <Text>{profile.bio}</Text>

                <Text fontSize="lg" fontWeight="bold">Interests</Text>
                <Wrap spacing={2}>
                  {profile.interests.map((interest, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="blue" borderRadius="full">
                        <TagLabel>{interest}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Text fontSize="lg" fontWeight="bold">Hobbies</Text>
                <Wrap spacing={2}>
                  {profile.hobbies.map((hobby, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="green" borderRadius="full">
                        <TagLabel>{hobby}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Text fontSize="lg" fontWeight="bold">Languages</Text>
                <Wrap spacing={2}>
                  {profile.languages.map((language, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="purple" borderRadius="full">
                        <TagLabel>{language}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Text fontSize="lg" fontWeight="bold">First Date Ideas</Text>
                <Wrap spacing={2}>
                  {profile.firstDateIdeas.map((idea, index) => (
                    <WrapItem key={index}>
                      <Tag size="md" colorScheme="orange" borderRadius="full">
                        <TagLabel>{idea}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Box>
                  <Text fontWeight="bold" mb={2}>Preferences</Text>
                  <VStack align="start" spacing={2}>
                    <Text>Looking for: {profile.lookingFor}</Text>
                    <Text>Relationship goals: {profile.relationshipGoals}</Text>
                    <Text>Smoking: {profile.smoking}</Text>
                    <Text>Drinking: {profile.drinking}</Text>
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </VStack>
        </Box>

        {/* Profile Form Modal */}
        <ProfileForm
          isOpen={isProfileModalOpen}
          onClose={() => {
            console.log('Closing edit profile modal');
            setIsProfileModalOpen(false);
          }}
          initialData={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      </VStack>
    </Box>
  );
};

export default WaitingScreen;