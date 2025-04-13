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

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const newProfile = await updateProfile(updatedProfile);
      setProfile(newProfile);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
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

  return (
    <Box minH="100vh" bg="gray.50" py={padding} px={padding}>
      <VStack spacing={8} maxW="container.md" mx="auto">
        <HStack w="100%" justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            Your Profile
          </Text>
          <HStack>
            <IconButton
              aria-label="Edit profile"
              icon={<FaEdit />}
              onClick={() => setIsProfileModalOpen(true)}
              colorScheme="blue"
            />
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
            </HStack>
              
              <Box>
                <Text fontWeight="bold" mb={2}>About Me</Text>
              <Text>{profile.bio}</Text>
              </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Interests</Text>
              <Wrap>
                {profile.interests.map((interest, index) => (
                      <WrapItem key={index}>
                    <Badge colorScheme="blue" p={2} m={1}>
                          {interest}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Hobbies</Text>
              <Wrap>
                {profile.hobbies.map((hobby, index) => (
                      <WrapItem key={index}>
                    <Badge colorScheme="green" p={2} m={1}>
                          {hobby}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Languages</Text>
              <Wrap>
                {profile.languages.map((language, index) => (
                      <WrapItem key={index}>
                    <Badge colorScheme="purple" p={2} m={1}>
                      {language}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>First Date Ideas</Text>
              <Wrap>
                {profile.firstDateIdeas.map((idea, index) => (
                      <WrapItem key={index}>
                    <Badge colorScheme="orange" p={2} m={1}>
                      {idea}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Preferences</Text>
              <VStack align="start" spacing={2}>
                <Text>Looking for: {profile.lookingFor}</Text>
                <Text>Relationship goals: {profile.relationshipGoals}</Text>
                <Text>Smoking: {profile.smoking}</Text>
                <Text>Drinking: {profile.drinking}</Text>
                </VStack>
            </Box>
            </VStack>
          </Box>

        {/* Profile Form Modal */}
        <ProfileForm
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialData={profile}
          onProfileUpdate={handleProfileUpdate}
        />
        </VStack>
    </Box>
  );
};

export default WaitingScreen;