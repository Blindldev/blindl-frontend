import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  FormErrorMessage,
  HStack,
  Text,
  useColorMode,
  Box,
} from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';

const ProfileForm = ({ isOpen, onClose, initialData, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    lookingFor: '',
    personality: {
      extroversion: '',
      agreeableness: '',
      conscientiousness: '',
      neuroticism: '',
      openness: '',
    },
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { updateProfile } = useProfile();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        gender: initialData.gender || '',
        location: initialData.location || '',
        bio: initialData.bio || '',
        lookingFor: initialData.lookingFor || '',
        personality: initialData.personality || {
          extroversion: '',
          agreeableness: '',
          conscientiousness: '',
          neuroticism: '',
          openness: '',
        },
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || isNaN(formData.age) || formData.age < 18) newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    
    Object.entries(formData.personality).forEach(([trait, value]) => {
      if (!value) newErrors[`personality.${trait}`] = `${trait} is required`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('personality.')) {
      const trait = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          [trait]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = initialData 
        ? `/api/profiles/${initialData.id}`
        : '/api/profiles';
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();
      updateProfile(data);
      onProfileUpdate?.(data);
      toast({
        title: 'Success!',
        description: `Profile ${initialData ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <ModalHeader color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
          {initialData ? 'Edit Profile' : 'Create Profile'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.age}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Age</FormLabel>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.age}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.gender}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select gender"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.location}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your location"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.location}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.bio}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Bio</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.bio}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lookingFor}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Looking For</FormLabel>
                <Select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="What are you looking for?"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                >
                  <option value="friendship">Friendship</option>
                  <option value="dating">Dating</option>
                  <option value="relationship">Relationship</option>
                </Select>
                <FormErrorMessage>{errors.lookingFor}</FormErrorMessage>
              </FormControl>

              <Box w="full" pt={4}>
                <Text fontWeight="bold" mb={4}>Personality Traits</Text>
                {Object.entries(formData.personality).map(([trait, value]) => (
                  <FormControl key={trait} isInvalid={!!errors[`personality.${trait}`]}>
                    <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                      {trait.charAt(0).toUpperCase() + trait.slice(1).replace(/([A-Z])/g, ' $1')}
                    </FormLabel>
                    <Select
                      name={`personality.${trait}`}
                      value={value}
                      onChange={handleChange}
                      placeholder={`Select ${trait} level`}
                      bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                    <FormErrorMessage>{errors[`personality.${trait}`]}</FormErrorMessage>
                  </FormControl>
                ))}
              </Box>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {initialData ? 'Update Profile' : 'Create Profile'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;