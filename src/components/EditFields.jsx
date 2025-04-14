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
  Avatar,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';

const CHICAGO_NEIGHBORHOODS = [
  'Lincoln Park', 'Wicker Park', 'Lakeview', 'Logan Square', 'River North',
  'West Loop', 'Gold Coast', 'Old Town', 'Bucktown', 'Pilsen'
];

const EditFields = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
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
    lookingFor: '',
  });

  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newDateIdea, setNewDateIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        location: profile.location || '',
        occupation: profile.occupation || '',
        education: profile.education || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        hobbies: profile.hobbies || [],
        languages: profile.languages || [],
        relationshipGoals: profile.relationshipGoals || '',
        smoking: profile.smoking || '',
        drinking: profile.drinking || '',
        firstDateIdeas: profile.firstDateIdeas || [],
        lookingFor: profile.lookingFor || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = (type) => {
    const newItem = type === 'interest' ? newInterest : 
                    type === 'hobby' ? newHobby :
                    type === 'language' ? newLanguage : newDateIdea;
    
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        [type === 'interest' ? 'interests' :
         type === 'hobby' ? 'hobbies' :
         type === 'language' ? 'languages' : 'firstDateIdeas']: 
          [...prev[type === 'interest' ? 'interests' :
                  type === 'hobby' ? 'hobbies' :
                  type === 'language' ? 'languages' : 'firstDateIdeas'], 
           newItem.trim()]
      }));
      
      if (type === 'interest') setNewInterest('');
      else if (type === 'hobby') setNewHobby('');
      else if (type === 'language') setNewLanguage('');
      else setNewDateIdea('');
    }
  };

  const handleRemoveItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    if (!formData.relationshipGoals) newErrors.relationshipGoals = 'Relationship goals is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/waiting');
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
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
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Avatar
                size="xl"
                src={profile?.picture}
                name={formData.name}
              />
            </FormControl>

            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
              />
            </FormControl>

            <FormControl isInvalid={errors.age}>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
              />
            </FormControl>

            <FormControl isInvalid={errors.gender}>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                placeholder="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <Select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Select your neighborhood"
              >
                {CHICAGO_NEIGHBORHOODS.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.occupation}>
              <FormLabel>Occupation</FormLabel>
              <Input
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Your occupation"
              />
            </FormControl>

            <FormControl isInvalid={errors.education}>
              <FormLabel>Education</FormLabel>
              <Input
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Your education"
              />
            </FormControl>

            <FormControl isInvalid={errors.bio}>
              <FormLabel>About Me</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </FormControl>

            <FormControl isInvalid={errors.lookingFor}>
              <FormLabel>Looking For</FormLabel>
              <Select
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleInputChange}
                placeholder="What are you looking for?"
              >
                <option value="dating">Dating</option>
                <option value="friendship">Friendship</option>
                <option value="casual">Casual</option>
                <option value="long-term">Long-term relationship</option>
                <option value="marriage">Marriage</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.relationshipGoals}>
              <FormLabel>Relationship Goals</FormLabel>
              <Select
                name="relationshipGoals"
                value={formData.relationshipGoals}
                onChange={handleInputChange}
                placeholder="What are your relationship goals?"
              >
                <option value="long-term">Long-term relationship</option>
                <option value="marriage">Marriage</option>
                <option value="short-term">Short-term relationship</option>
                <option value="friendship">Friendship</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Interests</FormLabel>
              <HStack>
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                />
                <Button onClick={() => handleAddItem('interest')}>
                  Add
                </Button>
              </HStack>
              <Box mt={2}>
                {formData.interests.map((interest, index) => (
                  <Tag key={index} mr={2} mb={2}>
                    <TagLabel>{interest}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveItem('interests', index)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Hobbies</FormLabel>
              <HStack>
                <Input
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  placeholder="Add a hobby"
                />
                <Button onClick={() => handleAddItem('hobby')}>
                  Add
                </Button>
              </HStack>
              <Box mt={2}>
                {formData.hobbies.map((hobby, index) => (
                  <Tag key={index} mr={2} mb={2}>
                    <TagLabel>{hobby}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveItem('hobbies', index)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Languages</FormLabel>
              <HStack>
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language"
                />
                <Button onClick={() => handleAddItem('language')}>
                  Add
                </Button>
              </HStack>
              <Box mt={2}>
                {formData.languages.map((language, index) => (
                  <Tag key={index} mr={2} mb={2}>
                    <TagLabel>{language}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveItem('languages', index)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>First Date Ideas</FormLabel>
              <HStack>
                <Input
                  value={newDateIdea}
                  onChange={(e) => setNewDateIdea(e.target.value)}
                  placeholder="Add a first date idea"
                />
                <Button onClick={() => handleAddItem('dateIdea')}>
                  Add
                </Button>
              </HStack>
              <Box mt={2}>
                {formData.firstDateIdeas.map((idea, index) => (
                  <Tag key={index} mr={2} mb={2}>
                    <TagLabel>{idea}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveItem('firstDateIdeas', index)} />
                  </Tag>
                ))}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Smoking</FormLabel>
              <Select
                name="smoking"
                value={formData.smoking}
                onChange={handleInputChange}
                placeholder="Select smoking preference"
              >
                <option value="never">Never</option>
                <option value="socially">Socially</option>
                <option value="regularly">Regularly</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Drinking</FormLabel>
              <Select
                name="drinking"
                value={formData.drinking}
                onChange={handleInputChange}
                placeholder="Select drinking preference"
              >
                <option value="never">Never</option>
                <option value="socially">Socially</option>
                <option value="regularly">Regularly</option>
              </Select>
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