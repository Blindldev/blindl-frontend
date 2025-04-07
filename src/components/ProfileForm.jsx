import {
  Box,
  VStack,
  Text,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Wrap,
  WrapItem,
  HStack,
  Icon,
  Link,
} from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import {
  Avatar,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  Progress,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_DIMENSION = 800;
const COMPRESSION_QUALITY = 0.7;

const ProfileForm = () => {
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: 18,
    location: '',
    occupation: '',
    education: '',
    bio: '',
    photo: null,
    interests: '',
    hobbies: '',
    languages: '',
    relationshipGoals: '',
    smoking: '',
    drinking: '',
    firstDateIdeas: '',
    password: '',
  });

  const relationshipGoals = [
    'Casual Dating',
    'Serious Relationship',
    'Marriage',
    'Friendship First',
    'Open to All'
  ];

  const interestEmojis = [
    { emoji: '🎨', label: 'Art' },
    { emoji: '🎵', label: 'Music' },
    { emoji: '��', label: 'Reading' },
    { emoji: '✈️', label: 'Travel' },
    { emoji: '🍳', label: 'Cooking' },
    { emoji: '🎮', label: 'Gaming' },
    { emoji: '🏃', label: 'Fitness' },
    { emoji: '🎬', label: 'Movies' },
    { emoji: '📸', label: 'Photography' },
    { emoji: '🎭', label: 'Theater' },
    { emoji: '🏔️', label: 'Outdoors' },
    { emoji: '🎪', label: 'Circus' },
    { emoji: '💃', label: 'Dance' },
    { emoji: '🎨', label: 'Design' },
    { emoji: '👕', label: 'Fashion' }
  ];

  const hobbyEmojis = [
    { emoji: '🏊', label: 'Swimming' },
    { emoji: '🚴', label: 'Cycling' },
    { emoji: '🎾', label: 'Tennis' },
    { emoji: '🏀', label: 'Basketball' },
    { emoji: '⚽', label: 'Soccer' },
    { emoji: '🎯', label: 'Archery' },
    { emoji: '🎨', label: 'Painting' },
    { emoji: '🎸', label: 'Guitar' },
    { emoji: '🎹', label: 'Piano' },
    { emoji: '🎭', label: 'Acting' },
    { emoji: '📝', label: 'Writing' },
    { emoji: '🧘', label: 'Yoga' },
    { emoji: '💃', label: 'Dancing' },
    { emoji: '🌱', label: 'Gardening' },
    { emoji: '♟️', label: 'Chess' }
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  // Update formData when interests or hobbies change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      interests: selectedInterests.join(', '),
      hobbies: selectedHobbies.join(', ')
    }));
  }, [selectedInterests, selectedHobbies]);

  // Memoized constants
  const chicagoNeighborhoods = [
    'Old Town', 'Logan Square', 'Lincoln Park', 'Lakeview', 'Wicker Park',
    'River North', 'Gold Coast', 'West Loop', 'South Loop', 'Bucktown',
    'Wrigleyville', 'Andersonville', 'Pilsen', 'Hyde Park', 'Lincoln Square',
    'Ukrainian Village', 'Bridgeport', 'Ravenswood', 'Edgewater', 'Uptown'
  ];

  const firstDateIdeas = [
    'Grab coffee at a local cafe',
    'Take a walk in the park',
    'Visit a museum',
    'Go for drinks at a bar',
    'Have dinner at a restaurant',
    'Watch a movie',
    'Attend a sports game',
    'Go to a concert',
    'Take a cooking class',
    'Visit an art gallery',
    'Go bowling',
    'Take a boat tour',
    'Visit a farmers market',
    'Go to a comedy show',
    'Take a pottery class'
  ];

  const educationOptions = [
    'High School',
    'Some College',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate'
  ];

  const smokingOptions = [
    'Just Drink',
    'Just Smoke (cigs)',
    'Just Smoke (weed)',
    'Everything',
    'None'
  ];

  const drinkingOptions = [
    'Just Smoke (cigs)',
    'Just Smoke (weed)',
    'Everything',
    'None'
  ];

  // Optimized image compression
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            COMPRESSION_QUALITY
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Optimized photo upload handler
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError(null);
    setUploadProgress(0);
    setIsUploading(true);

    try {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, or GIF.');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large. Maximum size is 5MB.');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const compressedFile = await compressImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = reader.result;
        setFormData(prev => ({
          ...prev,
          photo: newPhoto
        }));
        // Immediately update the profile context
        setProfile(prev => ({
          ...prev,
          photo: newPhoto
        }));
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          toast({
            title: 'Photo uploaded successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }, 500);
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(error.message);
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Optimized form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Optimized form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create profile');
      }

      const profile = await response.json();
      setProfile(profile);
      
      // Clear both isNewAccount and newAccountEmail flags
      localStorage.removeItem('isNewAccount');
      localStorage.removeItem('newAccountEmail');
      
      navigate('/waiting');
      
      toast({
        title: 'Success!',
        description: 'Your profile has been created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Profile creation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Profile Photo */}
          <FormControl>
            <FormLabel>Profile Photo</FormLabel>
            <VStack spacing={2}>
              <Box position="relative">
                <Avatar
                  size="xl"
                  src={formData.photo}
                  name={formData.name}
                  mb={2}
                />
                {isUploading && (
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="blackAlpha.500"
                    borderRadius="full"
                  >
                    <Spinner color="white" />
                  </Box>
                )}
              </Box>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                size="sm"
                display="none"
                id="photo-upload"
                disabled={isUploading}
              />
              <Button
                as="label"
                htmlFor="photo-upload"
                colorScheme="blue"
                size="sm"
                cursor={isUploading ? "not-allowed" : "pointer"}
                isLoading={isUploading}
                loadingText="Uploading..."
              >
                Upload Photo
              </Button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} size="sm" width="100%" />
              )}
              {uploadError && (
                <Alert status="error" size="sm" borderRadius="md">
                  <AlertIcon />
                  {uploadError}
                </Alert>
              )}
              <Text fontSize="xs" color="gray.500">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </Text>
            </VStack>
          </FormControl>

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
              value={formData.age}
              onChange={handleChange}
              type="number"
              min={18}
              max={100}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Neighborhood</FormLabel>
            <Select
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Select your neighborhood"
            >
              {chicagoNeighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Occupation</FormLabel>
            <Input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="What do you do?"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Education</FormLabel>
            <Select
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Select your education level"
            >
              {educationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
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
            <SimpleGrid columns={5} spacing={2}>
              {interestEmojis.map(({ emoji, label }) => (
                <Checkbox
                  key={label}
                  isChecked={selectedInterests.includes(label)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedInterests(prev => [...prev, label]);
                    } else {
                      setSelectedInterests(prev => prev.filter(i => i !== label));
                    }
                  }}
                  size="lg"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  _checked={{
                    bg: 'blue.100',
                    borderColor: 'blue.500',
                    color: 'blue.500',
                  }}
                  _hover={{
                    bg: 'blue.50',
                    borderColor: 'blue.300',
                  }}
                >
                  <Text fontSize="2xl">{emoji}</Text>
                  <Text fontSize="xs" mt={1}>{label}</Text>
                </Checkbox>
              ))}
            </SimpleGrid>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Hobbies</FormLabel>
            <SimpleGrid columns={5} spacing={2}>
              {hobbyEmojis.map(({ emoji, label }) => (
                <Checkbox
                  key={label}
                  isChecked={selectedHobbies.includes(label)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedHobbies(prev => [...prev, label]);
                    } else {
                      setSelectedHobbies(prev => prev.filter(h => h !== label));
                    }
                  }}
                  size="lg"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  _checked={{
                    bg: 'green.100',
                    borderColor: 'green.500',
                    color: 'green.500',
                  }}
                  _hover={{
                    bg: 'green.50',
                    borderColor: 'green.300',
                  }}
                >
                  <Text fontSize="2xl">{emoji}</Text>
                  <Text fontSize="xs" mt={1}>{label}</Text>
                </Checkbox>
              ))}
            </SimpleGrid>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Relationship Goals</FormLabel>
            <Select
              name="relationshipGoals"
              value={formData.relationshipGoals}
              onChange={handleChange}
              placeholder="Select your relationship goals"
            >
              {relationshipGoals.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Smoking Preferences</FormLabel>
            <Select
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
              placeholder="Select your smoking preferences"
            >
              {smokingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Drinking Preferences</FormLabel>
            <Select
              name="drinking"
              value={formData.drinking}
              onChange={handleChange}
              placeholder="Select your drinking preferences"
            >
              {drinkingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>First Date Ideas</FormLabel>
            <Select
              name="firstDateIdeas"
              value={formData.firstDateIdeas}
              onChange={handleChange}
              placeholder="Select your ideal first date"
            >
              {firstDateIdeas.map((idea) => (
                <option key={idea} value={idea}>
                  {idea}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              <InputRightElement h={'full'}>
                <IconButton
                  variant={'ghost'}
                  onClick={() => setShowPassword((showPassword) => !showPassword)}
                  icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Create Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProfileForm;
