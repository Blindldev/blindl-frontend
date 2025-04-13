import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Heading,
  Text,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';

const EditFields = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    interests: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) {
      navigate('/signin');
      return;
    }

    setFormData({
      name: profile.name || '',
      age: profile.age || '',
      gender: profile.gender || '',
      bio: profile.bio || '',
      interests: profile.interests || '',
      location: profile.location || '',
    });
  }, [profile, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3002/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      updateProfile(updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile fields have been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/waiting');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Edit Profile Fields</Heading>
        
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your location"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Interests</FormLabel>
              <Textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Your interests (comma separated)"
                rows={2}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              isLoading={loading}
            >
              Update Profile Fields
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/waiting')}
              width="full"
            >
              Cancel
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default EditFields; 