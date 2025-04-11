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
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    interests: '',
    hobbies: '',
    languages: '',
    relationshipGoals: '',
    smoking: '',
    drinking: '',
    firstDateIdeas: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
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
          interests: formData.interests.split(',').map(i => i.trim()),
          hobbies: formData.hobbies.split(',').map(h => h.trim()),
          languages: formData.languages.split(',').map(l => l.trim()),
          firstDateIdeas: formData.firstDateIdeas.split(',').map(d => d.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      toast({
        title: 'Profile created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/waiting');
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

  return (
    <Container maxW="container.md" py={10}>
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
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your location"
              />
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

            <FormControl>
              <FormLabel>Interests (comma separated)</FormLabel>
              <Input
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. hiking, reading, cooking"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Hobbies (comma separated)</FormLabel>
              <Input
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="e.g. photography, yoga, gaming"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Languages (comma separated)</FormLabel>
              <Input
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. English, Spanish, French"
              />
            </FormControl>

            <FormControl>
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
              </Select>
            </FormControl>

            <FormControl>
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

            <FormControl>
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
              <FormLabel>First Date Ideas (comma separated)</FormLabel>
              <Input
                name="firstDateIdeas"
                value={formData.firstDateIdeas}
                onChange={handleChange}
                placeholder="e.g. coffee, museum, hiking"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
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