import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  FormErrorMessage,
  HStack,
  Badge,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const CHICAGO_NEIGHBORHOODS = [
  'Lincoln Park', 'Wicker Park', 'Lakeview', 'Logan Square', 'River North',
  'West Loop', 'Gold Coast', 'Old Town', 'Bucktown', 'Pilsen'
];

const DATE_SPOTS = [
  'Art Institute of Chicago', 'Millennium Park', 'Navy Pier', 'Willis Tower Skydeck',
  'Chicago Riverwalk', 'Garfield Park Conservatory', 'Lincoln Park Zoo', 'Shedd Aquarium',
  'Field Museum', 'Museum of Science and Industry'
];

const CreateProfile = () => {
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
    photos: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempInterest, setTempInterest] = useState('');
  const [tempHobby, setTempHobby] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');
  const [tempDateIdea, setTempDateIdea] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile } = useProfile();
  const email = location.state?.email;

  // Responsive styles
  const containerWidth = useBreakpointValue({ base: '100%', md: 'md' });
  const padding = useBreakpointValue({ base: 4, md: 10 });
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'md' });

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addToList = (listName, value, setTempValue) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
      setTempValue('');
    }
  };

  const removeFromList = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    if (formData.interests.length === 0) newErrors.interests = 'At least one interest is required';
    if (formData.hobbies.length === 0) newErrors.hobbies = 'At least one hobby is required';
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
    if (formData.firstDateIdeas.length === 0) newErrors.firstDateIdeas = 'At least one first date idea is required';
    if (!formData.relationshipGoals) newErrors.relationshipGoals = 'Relationship goals are required';
    if (!formData.smoking) newErrors.smoking = 'Smoking preference is required';
    if (!formData.drinking) newErrors.drinking = 'Drinking preference is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data = await response.json();
      console.log('Profile creation response:', data);
      
      // Update profile in context with the complete profile data
      const updatedProfile = {
        ...data,
        status: 'pending',
        updatedAt: new Date().toISOString()
      };
      
      // Set the profile in context
      setProfile(updatedProfile);
      
      // Wait a moment to ensure the profile is set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Profile created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to waiting page
      navigate('/waiting');
    } catch (error) {
      console.error('Profile creation error:', error);
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
    <Container maxW={containerWidth} py={padding} px={padding}>
      <VStack spacing={8} align="stretch">
        <Heading>Create Your Profile</Heading>
        <Text>Tell us about yourself to help us find your perfect match.</Text>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.age}>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
              />
              <FormErrorMessage>{errors.age}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.gender}>
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
              <FormErrorMessage>{errors.gender}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.lookingFor}>
              <FormLabel>Looking For</FormLabel>
              <Select
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                placeholder="Select what you're looking for"
              >
                <option value="relationship">Relationship</option>
                <option value="friendship">Friendship</option>
                <option value="casual">Casual Dating</option>
              </Select>
              <FormErrorMessage>{errors.lookingFor}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Select your neighborhood"
              >
                {CHICAGO_NEIGHBORHOODS.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Occupation</FormLabel>
              <Input
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Your occupation"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Education</FormLabel>
              <Input
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Your education"
              />
            </FormControl>

            <FormControl isInvalid={errors.bio}>
              <FormLabel>Bio</FormLabel>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
              <FormErrorMessage>{errors.bio}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.interests}>
              <FormLabel>Interests</FormLabel>
              <HStack>
                <Input
                  value={tempInterest}
                  onChange={(e) => setTempInterest(e.target.value)}
                  placeholder="Add an interest"
                />
                <Button onClick={() => addToList('interests', tempInterest, setTempInterest)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2}>
                {formData.interests.map((interest, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="blue"
                      p={2}
                      m={1}
                      cursor="pointer"
                      onClick={() => removeFromList('interests', index)}
                    >
                      {interest}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.interests}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.hobbies}>
              <FormLabel>Hobbies</FormLabel>
              <HStack>
                <Input
                  value={tempHobby}
                  onChange={(e) => setTempHobby(e.target.value)}
                  placeholder="Add a hobby"
                />
                <Button onClick={() => addToList('hobbies', tempHobby, setTempHobby)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2}>
                {formData.hobbies.map((hobby, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="green"
                      p={2}
                      m={1}
                      cursor="pointer"
                      onClick={() => removeFromList('hobbies', index)}
                    >
                      {hobby}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.hobbies}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.languages}>
              <FormLabel>Languages</FormLabel>
              <HStack>
                <Input
                  value={tempLanguage}
                  onChange={(e) => setTempLanguage(e.target.value)}
                  placeholder="Add a language"
                />
                <Button onClick={() => addToList('languages', tempLanguage, setTempLanguage)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2}>
                {formData.languages.map((language, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="purple"
                      p={2}
                      m={1}
                      cursor="pointer"
                      onClick={() => removeFromList('languages', index)}
                    >
                      {language}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.languages}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.relationshipGoals}>
              <FormLabel>Relationship Goals</FormLabel>
              <Select
                name="relationshipGoals"
                value={formData.relationshipGoals}
                onChange={handleChange}
                placeholder="Select your relationship goals"
              >
                <option value="long-term">Long-term relationship</option>
                <option value="marriage">Marriage</option>
                <option value="casual">Casual dating</option>
                <option value="friendship">Friendship first</option>
              </Select>
              <FormErrorMessage>{errors.relationshipGoals}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.smoking}>
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
              <FormErrorMessage>{errors.smoking}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.drinking}>
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
              <FormErrorMessage>{errors.drinking}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.firstDateIdeas}>
              <FormLabel>First Date Ideas</FormLabel>
              <HStack>
                <Input
                  value={tempDateIdea}
                  onChange={(e) => setTempDateIdea(e.target.value)}
                  placeholder="Add a first date idea"
                />
                <Button onClick={() => addToList('firstDateIdeas', tempDateIdea, setTempDateIdea)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2}>
                {formData.firstDateIdeas.map((idea, index) => (
                  <WrapItem key={index}>
                    <Badge
                      colorScheme="orange"
                      p={2}
                      m={1}
                      cursor="pointer"
                      onClick={() => removeFromList('firstDateIdeas', index)}
                    >
                      {idea}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.firstDateIdeas}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              size={buttonSize}
              isLoading={isLoading}
            >
              Create Profile
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default CreateProfile; 