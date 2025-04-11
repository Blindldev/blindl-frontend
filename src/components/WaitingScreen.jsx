import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  useColorMode,
  IconButton,
  HStack,
  Card,
  CardBody,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';
import ProfileForm from './ProfileForm';
import BlurredProfiles from './BlurredProfiles';
import { useProfile } from '../context/ProfileContext';

const WaitingScreen = () => {
  const { colorMode } = useColorMode();
  const { profile } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!profile) {
    return (
      <Box p={4}>
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={8} align="stretch">
        <Card bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <CardBody>
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Your Profile</Heading>
              <IconButton
                icon={<FaEdit />}
                onClick={() => setIsEditModalOpen(true)}
                aria-label="Edit profile"
              />
            </HStack>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold">Name</Text>
                <Text>{profile.name}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Age</Text>
                <Text>{profile.age}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Location</Text>
                <Text>{profile.location}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Bio</Text>
                <Text>{profile.bio}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Looking For</Text>
                <Text>{profile.lookingFor}</Text>
              </Box>
              <Divider />
              <Box>
                <Text fontWeight="bold" mb={2}>Personality Profile</Text>
                {Object.entries(profile.personality || {}).map(([trait, value]) => (
                  <Text key={trait}>
                    {trait.charAt(0).toUpperCase() + trait.slice(1).replace(/([A-Z])/g, ' $1')}: {value}
                  </Text>
                ))}
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <BlurredProfiles />

        <ProfileForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={profile}
          onProfileUpdate={(updatedProfile) => {
            // Profile update is handled by the context
            setIsEditModalOpen(false);
          }}
        />
      </VStack>
    </Box>
  );
};

export default WaitingScreen; 