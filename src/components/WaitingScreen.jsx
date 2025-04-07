import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Container,
  Heading,
  Button,
  useColorMode,
  HStack,
  Divider,
  Wrap,
  WrapItem,
  Badge,
  Input,
  Select,
  Textarea,
  IconButton,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import BlurredProfiles from './BlurredProfiles';
import { FaEdit, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { API_URL } from '../config';

const WaitingScreen = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newArrayItem, setNewArrayItem] = useState('');

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

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
    setNewArrayItem('');
  };

  const handleSaveEdit = async () => {
    if (!editingField) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          [editingField]: editValue
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      
      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setEditingField(null);
      setEditValue('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArrayItem = async (field) => {
    if (!newArrayItem.trim()) return;

    const updatedArray = [...(profile[field] || []), newArrayItem.trim()];
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          [field]: updatedArray
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      
      toast({
        title: 'Success!',
        description: 'Item added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewArrayItem('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveArrayItem = async (field, item) => {
    const updatedArray = profile[field].filter(i => i !== item);
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          [field]: updatedArray
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      
      toast({
        title: 'Success!',
        description: 'Item removed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditableField = (label, field, value) => {
    if (editingField === field) {
      return (
        <HStack spacing={2}>
          {field === 'bio' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
            />
          ) : field === 'gender' || field === 'lookingFor' ? (
            <Select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
            >
              {field === 'gender' ? (
                <>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </>
              ) : (
                <>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="both">Both</option>
                </>
              )}
            </Select>
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="sm"
            />
          )}
          <IconButton
            icon={<FaCheck />}
            size="sm"
            colorScheme="green"
            onClick={handleSaveEdit}
            isLoading={isLoading}
          />
          <IconButton
            icon={<FaTimes />}
            size="sm"
            colorScheme="red"
            onClick={handleCancelEdit}
          />
        </HStack>
      );
    }

    return (
      <HStack spacing={2}>
        <Text>{value}</Text>
        <IconButton
          icon={<FaEdit />}
          size="sm"
          onClick={() => handleEditClick(field, value)}
        />
      </HStack>
    );
  };

  const renderArrayField = (label, field) => {
    return (
      <VStack align="start" spacing={2}>
        <HStack spacing={2}>
          <Input
            value={newArrayItem}
            onChange={(e) => setNewArrayItem(e.target.value)}
            placeholder={`Add new ${label.toLowerCase()}`}
            size="sm"
          />
          <IconButton
            icon={<FaPlus />}
            size="sm"
            colorScheme="blue"
            onClick={() => handleAddArrayItem(field)}
            isLoading={isLoading}
          />
        </HStack>
        <Wrap spacing={2}>
          {profile[field]?.map((item, index) => (
            <WrapItem key={index}>
              <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                <TagLabel>{item}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveArrayItem(field, item)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    );
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8}>
          <HStack justify="space-between" width="100%">
            <Heading size="lg">Welcome, {profile?.name || 'Friend'}!</Heading>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>

          <Box
            p={8}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="lg"
            width="100%"
          >
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md">Basic Information</Heading>
                <VStack align="start" spacing={2} mt={2}>
                  <Text>Name: {profile?.name}</Text>
                  <Text>Age: {renderEditableField('Age', 'age', profile?.age)}</Text>
                  <Text>Gender: {renderEditableField('Gender', 'gender', profile?.gender)}</Text>
                  <Text>Looking For: {renderEditableField('Looking For', 'lookingFor', profile?.lookingFor)}</Text>
                  <Text>Location: {renderEditableField('Location', 'location', profile?.location)}</Text>
                  <Text>Occupation: {renderEditableField('Occupation', 'occupation', profile?.occupation)}</Text>
                  <Text>Education: {renderEditableField('Education', 'education', profile?.education)}</Text>
                  <Text>Bio: {renderEditableField('Bio', 'bio', profile?.bio)}</Text>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md">Interests</Heading>
                {renderArrayField('Interest', 'interests')}
              </Box>

              <Divider />

              <Box>
                <Heading size="md">Hobbies</Heading>
                {renderArrayField('Hobby', 'hobbies')}
              </Box>

              <Divider />

              <Box>
                <Heading size="md">Languages</Heading>
                {renderArrayField('Language', 'languages')}
              </Box>

              <Divider />

              <Box>
                <Heading size="md">Preferences</Heading>
                <VStack align="start" spacing={2} mt={2}>
                  <Text>Relationship Goals: {renderEditableField('Relationship Goals', 'relationshipGoals', profile?.relationshipGoals)}</Text>
                  <Text>Smoking: {renderEditableField('Smoking', 'smoking', profile?.smoking)}</Text>
                  <Text>Drinking: {renderEditableField('Drinking', 'drinking', profile?.drinking)}</Text>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading size="md">First Date Ideas</Heading>
                {renderArrayField('First Date Idea', 'firstDateIdeas')}
              </Box>
            </VStack>
          </Box>

          <BlurredProfiles />
        </VStack>
      </Container>
    </Box>
  );
};

export default WaitingScreen;
