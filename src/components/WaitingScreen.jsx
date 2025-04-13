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
} from '@chakra-ui/react';
import { FaEdit, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaHeart, FaBrain } from 'react-icons/fa';
import ProfileForm from './ProfileForm';
import { useProfile } from '../context/ProfileContext';

const WaitingScreen = () => {
  const { colorMode } = useColorMode();
  const { profile, setProfile, updateProfile } = useProfile();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setIsLoading(false);
    }
  }, [profile]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const newProfile = await updateProfile(updatedProfile);
      setProfile(newProfile);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your profile...</Text>
      </Container>
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
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Box
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
            p={6}
          borderRadius="xl"
          boxShadow="md"
        >
          <HStack spacing={4} justify="space-between">
            <HStack spacing={4}>
                <Avatar
                  size="xl"
                  name={profile.name}
                src={profile.photos?.[0]}
                borderWidth="2px"
                borderColor={colorMode === 'light' ? 'pink.200' : 'pink.700'}
                />
                <VStack align="start" spacing={1}>
                <Heading size="lg">{profile.name}, {profile.age}</Heading>
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                  <Text>{profile.location}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
                    {profile.gender}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                    Looking for {profile.lookingFor}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <IconButton
              icon={<FaEdit />}
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="Edit profile"
              colorScheme="blue"
              variant="outline"
            />
          </HStack>
        </Box>

        {/* Profile Details */}
        <Box
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={6}
          borderRadius="xl"
          boxShadow="md"
        >
          <VStack spacing={6} align="stretch">
            {/* Basic Info */}
            <VStack align="start" spacing={2}>
              <Heading size="md">About Me</Heading>
              <Text>{profile.bio}</Text>
                </VStack>

            <Divider />

            {/* Lifestyle */}
            <VStack align="start" spacing={2}>
              <Heading size="md">Lifestyle</Heading>
              <HStack spacing={4}>
                <HStack>
                  <Icon as={FaBriefcase} />
                  <Text>{profile.occupation}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaGraduationCap} />
                  <Text>{profile.education}</Text>
                </HStack>
              </HStack>
              <HStack spacing={4}>
                <Badge colorScheme={profile.smoking === 'Never' ? 'green' : 'red'} variant="subtle">
                  Smoking: {profile.smoking}
                </Badge>
                <Badge colorScheme={profile.drinking === 'Never' ? 'green' : 'blue'} variant="subtle">
                  Drinking: {profile.drinking}
                </Badge>
              </HStack>
            </VStack>
              
            <Divider />

            {/* Interests & Hobbies */}
                <VStack align="start" spacing={2}>
              <Heading size="md">Interests & Hobbies</Heading>
                  <Wrap spacing={2}>
                {profile.interests.map((interest, index) => (
                      <WrapItem key={index}>
                    <Tag size="md" colorScheme="blue">
                      <TagLabel>{interest}</TagLabel>
                    </Tag>
                      </WrapItem>
                    ))}
                {profile.hobbies.map((hobby, index) => (
                      <WrapItem key={index}>
                    <Tag size="md" colorScheme="green">
                      <TagLabel>{hobby}</TagLabel>
                    </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>

            <Divider />

            {/* Languages & Date Ideas */}
                <VStack align="start" spacing={2}>
              <Heading size="md">Languages & Date Ideas</Heading>
                  <Wrap spacing={2}>
                {profile.languages.map((language, index) => (
                      <WrapItem key={index}>
                    <Tag size="md" colorScheme="purple">
                      <TagLabel>{language}</TagLabel>
                    </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  <Wrap spacing={2}>
                {profile.firstDateIdeas.map((idea, index) => (
                      <WrapItem key={index}>
                    <Tag size="md" colorScheme="pink">
                      <TagLabel>{idea}</TagLabel>
                    </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>

            <Divider />

            {/* Personality Profile */}
            <VStack align="start" spacing={2}>
              <Heading size="md">Personality Profile</Heading>
              {profile.personality && Object.entries(profile.personality).map(([trait, value]) => (
                <Box key={trait} width="100%">
                  <HStack justify="space-between" mb={1}>
                    <Text>{trait.charAt(0).toUpperCase() + trait.slice(1)}</Text>
                    <Text fontWeight="bold">{value}/10</Text>
                  </HStack>
                  <Progress
                    value={value * 10}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              ))}
              {!profile.personality && (
                <Text color="gray.500">Personality profile not available</Text>
              )}
            </VStack>
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
      </Container>
  );
};

export default WaitingScreen;