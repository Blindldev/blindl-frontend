import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  useToast,
  useColorMode,
  Text,
  Avatar,
  IconButton,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  FormErrorMessage,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Wrap,
  WrapItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useProfile } from '../context/ProfileContext';
import { FaCamera, FaPlus, FaMinus, FaTrash, FaEdit } from 'react-icons/fa';

const ProfileForm = ({ initialProfile, onProfileUpdate, isEditing }) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { setProfile } = useProfile();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    lookingFor: '',
    location: '',
    occupation: '',
    education: '',
    bio: '',
    interests: [],
    hobbies: [],
    languages: [],
    relationshipGoals: '',
    smoking: '',
    drinking: '',
    firstDateIdeas: [],
  });

  useEffect(() => {
    if (initialProfile) {
      console.log('Setting initial profile data:', initialProfile);
      setFormData({
        ...initialProfile,
        interests: initialProfile.interests || [],
        hobbies: initialProfile.hobbies || [],
        languages: initialProfile.languages || [],
        firstDateIdeas: initialProfile.firstDateIdeas || [],
      });
    }
  }, [initialProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const input = e.target.previousElementSibling;
    const value = input.value.trim();
    if (value && !formData.interests.includes(value)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
      input.value = '';
    }
  };

  const handleHobbyChange = (e) => {
    const input = e.target.previousElementSibling;
    const value = input.value.trim();
    if (value && !formData.hobbies.includes(value)) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, value]
      }));
      input.value = '';
    }
  };

  const handleLanguageChange = (e) => {
    const input = e.target.previousElementSibling;
    const value = input.value.trim();
    if (value && !formData.languages.includes(value)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, value]
      }));
      input.value = '';
    }
  };

  const handleFirstDateIdeaChange = (e) => {
    const input = e.target.previousElementSibling;
    const value = input.value.trim();
    if (value && !formData.firstDateIdeas.includes(value)) {
      setFormData(prev => ({
        ...prev,
        firstDateIdeas: [...prev.firstDateIdeas, value]
      }));
      input.value = '';
    }
  };

  const removeItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = isEditing 
        ? `${API_URL}/api/profiles/${formData.id}`
        : `${API_URL}/api/profiles`;
      
      console.log('Submitting profile update:', { url, formData, isEditing });
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      const data = await response.json();
      console.log('Profile update response:', data);
      
      if (isEditing) {
        onProfileUpdate(data);
        toast({
          title: 'Success!',
          description: 'Profile updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setProfile(data);
        localStorage.setItem('profile', JSON.stringify(data));
        navigate('/waiting');
        toast({
          title: 'Success!',
          description: 'Profile created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
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

  return (
    <Box
      p={6}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="lg"
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Gender</FormLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Select your gender"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Looking For</FormLabel>
            <Select
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
              placeholder="Select who you're looking for"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="both">Both</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Occupation</FormLabel>
            <Input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter your occupation"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Education</FormLabel>
            <Input
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Enter your education"
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

          <FormControl>
            <FormLabel>Interests</FormLabel>
            <Input
              placeholder="Add an interest"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInterestChange(e);
                }
              }}
            />
            <Button mt={2} onClick={handleInterestChange}>Add Interest</Button>
            <Wrap mt={2} spacing={2}>
              {formData.interests.map((interest, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{interest}</TagLabel>
                    <TagCloseButton onClick={() => removeItem('interests', interest)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl>
            <FormLabel>Hobbies</FormLabel>
            <Input
              placeholder="Add a hobby"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleHobbyChange(e);
                }
              }}
            />
            <Button mt={2} onClick={handleHobbyChange}>Add Hobby</Button>
            <Wrap mt={2} spacing={2}>
              {formData.hobbies.map((hobby, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="green">
                    <TagLabel>{hobby}</TagLabel>
                    <TagCloseButton onClick={() => removeItem('hobbies', hobby)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl>
            <FormLabel>Languages</FormLabel>
            <Input
              placeholder="Add a language"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLanguageChange(e);
                }
              }}
            />
            <Button mt={2} onClick={handleLanguageChange}>Add Language</Button>
            <Wrap mt={2} spacing={2}>
              {formData.languages.map((language, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="purple">
                    <TagLabel>{language}</TagLabel>
                    <TagCloseButton onClick={() => removeItem('languages', language)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Relationship Goals</FormLabel>
            <Select
              name="relationshipGoals"
              value={formData.relationshipGoals}
              onChange={handleChange}
              placeholder="Select your relationship goals"
            >
              <option value="dating">Dating</option>
              <option value="long-term">Long-term Relationship</option>
              <option value="marriage">Marriage</option>
              <option value="friendship">Friendship</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Smoking</FormLabel>
            <Select
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
              placeholder="Select your smoking preference"
            >
              <option value="never">Never</option>
              <option value="socially">Socially</option>
              <option value="regularly">Regularly</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Drinking</FormLabel>
            <Select
              name="drinking"
              value={formData.drinking}
              onChange={handleChange}
              placeholder="Select your drinking preference"
            >
              <option value="never">Never</option>
              <option value="socially">Socially</option>
              <option value="regularly">Regularly</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>First Date Ideas</FormLabel>
            <Input
              placeholder="Add a first date idea"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFirstDateIdeaChange(e);
                }
              }}
            />
            <Button mt={2} onClick={handleFirstDateIdeaChange}>Add Idea</Button>
            <Wrap mt={2} spacing={2}>
              {formData.firstDateIdeas.map((idea, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="orange">
                    <TagLabel>{idea}</TagLabel>
                    <TagCloseButton onClick={() => removeItem('firstDateIdeas', idea)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            isLoading={isLoading}
            loadingText={isEditing ? 'Updating...' : 'Saving...'}
          >
            {isEditing ? 'Update Profile' : 'Save Profile'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProfileForm;
