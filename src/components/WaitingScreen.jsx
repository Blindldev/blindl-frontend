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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Link,
} from '@chakra-ui/react';
import { FaEdit, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaHeart, FaBrain, FaUser, FaInstagram } from 'react-icons/fa';
import EditFields from './EditFields';
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
      console.log('Starting profile update...');
      console.log('Current profile email:', profile.email);
      console.log('Profile data to update:', updatedProfile);

      const response = await fetch('http://localhost:3002/api/profiles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: profile.email,
          profileData: updatedProfile
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Fetch the latest profile data
        const profileResponse = await fetch('http://localhost:3002/api/profiles/current', {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        if (profileData.success) {
          setProfile(profileData.user);
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsProfileModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        status: "error",
        duration: 3000,
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

  const handlePhotoClick = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('photo', file);
          formData.append('email', profile.email);

          const response = await fetch('http://localhost:3002/api/profiles/update-photo', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to update photo');
          }

          const data = await response.json();
          console.log('Photo update response:', data);

          if (data.success) {
            // Update the profile through the update endpoint
            const updateResponse = await fetch('http://localhost:3002/api/profiles/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: profile.email,
                profileData: {
                  ...profile,
                  photos: [data.photoUrl, ...(profile.photos || [])].slice(0, 5) // Keep only the 5 most recent photos
                }
              }),
            });

            if (!updateResponse.ok) {
              throw new Error('Failed to update profile with new photo');
            }

            const updateData = await updateResponse.json();
            console.log('Profile update response:', updateData);

            if (updateData.success) {
              // Update the profile in context
              setProfile(prev => ({
                ...prev,
                photos: [data.photoUrl, ...(prev.photos || [])].slice(0, 5)
              }));

              toast({
                title: 'Success',
                description: 'Profile photo updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            }
          }
        }
      };
      input.click();
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
        
        <Box
          p={6}
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          position="relative"
        >
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="lg">Your Profile</Heading>
            <Button
              colorScheme="blue"
              onClick={() => setIsProfileModalOpen(true)}
              size="sm"
              rightIcon={<FaEdit />}
            >
              Edit Profile
            </Button>
          </HStack>

          <HStack spacing={8} align="start">
            <Box position="relative">
              <Box
                position="relative"
                width="150px"
                height="150px"
                borderRadius="full"
                overflow="hidden"
                cursor="pointer"
                onClick={handlePhotoClick}
                border="2px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.500' }}
              >
                {profile.photos && profile.photos.length > 0 ? (
                  <Image
                    src={profile.photos[0]}
                    alt="Profile"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Center width="100%" height="100%" bg="gray.100">
                    <Icon as={FaUser} boxSize={8} color="gray.400" />
                  </Center>
                )}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  bg="rgba(0, 0, 0, 0.5)"
                  color="white"
                  p={2}
                  textAlign="center"
                  fontSize="sm"
                >
                  Click to update photo
                </Box>
              </Box>
            </Box>

            <VStack align="start" flex={1} spacing={4}>
              <HStack>
                <Text fontSize="xl" fontWeight="bold">👤 {profile?.name || 'Anonymous'}</Text>
              </HStack>
              <HStack>
                <Text>🎂 {profile?.age} • {profile?.gender}</Text>
              </HStack>
              <HStack>
                <Text>📍 {profile?.location}</Text>
              </HStack>
              <HStack>
                <Text>💼 {profile?.occupation}</Text>
              </HStack>
              <HStack>
                <Text>🎓 {profile?.education}</Text>
              </HStack>
            </VStack>
          </HStack>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2} color="blue.500">
              🔍 Searching for a match
            </Text>
            <Text color="gray.600">
              We're looking for someone who matches your preferences and interests. 
              This process can take a few weeks and is not guaranteed, but we do our best to find the perfect match for you!
            </Text>
            <Box mt={4} position="relative" width="300px" height="300px" mx="auto">
              <Image
                src={samplePhotos[currentPhotoIndex]}
                alt="Potential match"
                width="100%"
                height="100%"
                objectFit="cover"
                borderRadius="lg"
                filter="blur(10px)"
                transition="all 0.5s ease-in-out"
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                color="white"
                textShadow="0 0 10px rgba(0,0,0,0.5)"
              >
                <Text fontSize="xl" fontWeight="bold">Finding Your Match</Text>
                <Text fontSize="sm">Please be patient while we search</Text>
              </Box>
            </Box>
            <Box mt={4} textAlign="center">
              <HStack justify="center" spacing={2}>
                <FaInstagram size={24} color="#E1306C" />
                <Link 
                  href="https://www.instagram.com/blinddatepottery" 
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.500"
                  fontWeight="medium"
                >
                  @blinddatepottery
                </Link>
              </HStack>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Follow us on Instagram for updates on the future of this app
              </Text>
            </Box>
          </Box>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2} color="blue.500">
              👤 About Me
            </Text>
            <Text>{profile?.bio}</Text>
          </Box>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>🎯 Interests</Text>
            <Wrap>
              {profile?.interests?.map((interest, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="blue">{interest}</Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>🎨 Hobbies</Text>
            <Wrap>
              {profile?.hobbies?.map((hobby, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="green">{hobby}</Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>🌐 Languages</Text>
            <Wrap>
              {profile?.languages?.map((language, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="purple">{language}</Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box mt={6}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>💡 First Date Ideas</Text>
            <Wrap>
              {profile?.firstDateIdeas?.map((idea, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="orange">{idea}</Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </Box>

        <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EditFields />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default WaitingScreen;