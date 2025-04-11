import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Textarea,
  Progress,
  Box,
  Icon,
  useColorMode,
  Badge,
  Divider,
  Heading,
  Avatar,
  Tooltip,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Collapse,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaHeart,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaBrain,
} from 'react-icons/fa';

const MotionBox = motion(Box);

const ProfileForm = ({ isOpen, onClose, initialData, onProfileUpdate }) => {
  const { colorMode } = useColorMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bioLength, setBioLength] = useState(0);
  const [profile, setProfile] = useState(initialData || {
    name: '',
    age: '',
    location: '',
    gender: '',
    lookingFor: '',
    bio: '',
    photoUrl: '',
    personality: {
      openness: '',
      conscientiousness: '',
      extraversion: '',
      agreeableness: '',
      neuroticism: '',
    },
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const totalSteps = 5;
  const maxBioLength = 500;

  useEffect(() => {
    if (initialData) {
      setProfile(initialData);
      setBioLength(initialData.bio?.length || 0);
    }
  }, [initialData]);

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!profile.name) newErrors.name = 'Name is required';
        if (!profile.age) newErrors.age = 'Age is required';
        if (!profile.location) newErrors.location = 'Location is required';
        break;
      case 2:
        if (!profile.gender) newErrors.gender = 'Gender is required';
        if (!profile.lookingFor) newErrors.lookingFor = 'Looking for is required';
        break;
      case 3:
        if (!profile.bio) newErrors.bio = 'Bio is required';
        if (profile.bio.length < 50) newErrors.bio = 'Bio should be at least 50 characters';
        break;
      case 4:
        Object.entries(profile.personality).forEach(([key, value]) => {
          if (!value) newErrors[`personality.${key}`] = 'This field is required';
        });
        break;
      default:
        break;
    }
    setErrors(newErrors);
    setShowError(Object.keys(newErrors).length > 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      setShowError(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setShowError(false);
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    setBioLength(value.length);
    setProfile({ ...profile, bio: value });
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://localhost:3002/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(profile),
      });

      if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedProfile = await response.json();
        onProfileUpdate(updatedProfile);
      toast({
        title: 'Success!',
          description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
        onClose();
    } catch (error) {
      toast({
        title: 'Error',
          description: 'Failed to update profile',
        status: 'error',
          duration: 3000,
        isClosable: true,
      });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
  return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                Let's Get Started
              </Heading>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Tell us a bit about yourself to help us find your perfect match.
              </Text>
              <FormControl isInvalid={errors.name}>
                <FormLabel>Your Name</FormLabel>
                <InputGroup>
            <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    size="lg"
                  />
                  <InputRightElement>
                    <Icon as={FaUser} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
              <FormControl isInvalid={errors.age}>
                <FormLabel>Your Age</FormLabel>
                <NumberInput
                  value={profile.age}
                  onChange={(value) => setProfile({ ...profile, age: value })}
              min={18}
              max={100}
                  size="lg"
                >
                  <NumberInputField placeholder="Enter your age" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.age}</FormErrorMessage>
          </FormControl>
              <FormControl isInvalid={errors.location}>
                <FormLabel>Your Location</FormLabel>
                <InputGroup>
            <Input
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Enter your location"
                    size="lg"
                  />
                  <InputRightElement>
                    <Icon as={FaMapMarkerAlt} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.location}</FormErrorMessage>
          </FormControl>
            </VStack>
          </MotionBox>
        );
      case 2:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                Your Preferences
              </Heading>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Help us understand who you are and what you're looking for.
              </Text>
              <FormControl isInvalid={errors.gender}>
                <FormLabel>
                  <HStack spacing={2}>
                    <Text>Gender</Text>
                    <Tooltip label="This helps us find better matches for you">
                      <Icon as={FaInfoCircle} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                    </Tooltip>
                  </HStack>
                </FormLabel>
            <Select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  placeholder="Select your gender"
                  size="lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
          </FormControl>
              <FormControl isInvalid={errors.lookingFor}>
                <FormLabel>
                  <HStack spacing={2}>
                    <Text>Looking For</Text>
                    <Tooltip label="What kind of relationship are you interested in?">
                      <Icon as={FaHeart} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Select
                  value={profile.lookingFor}
                  onChange={(e) => setProfile({ ...profile, lookingFor: e.target.value })}
                  placeholder="Select what you're looking for"
                  size="lg"
                >
                  <option value="Dating">Dating</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Relationship">Relationship</option>
                </Select>
                <FormErrorMessage>{errors.lookingFor}</FormErrorMessage>
          </FormControl>
            </VStack>
          </MotionBox>
        );
      case 3:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                Your Story
              </Heading>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Share a bit about yourself to help others get to know you better.
              </Text>
              <FormControl isInvalid={errors.bio}>
                <FormLabel>About You</FormLabel>
                <Textarea
                  value={profile.bio}
                  onChange={handleBioChange}
                  placeholder="Tell us about yourself..."
                  size="lg"
                  rows={6}
                />
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                    {bioLength}/{maxBioLength} characters
                  </Text>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                    {bioLength < 50 ? `${50 - bioLength} more characters needed` : '✓ Good length'}
                  </Text>
                </HStack>
                <FormErrorMessage>{errors.bio}</FormErrorMessage>
          </FormControl>
            </VStack>
          </MotionBox>
        );
      case 4:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                Personality Profile
              </Heading>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Rate yourself on these personality traits to help us find better matches.
              </Text>
              {Object.entries(profile.personality).map(([key, value]) => (
                <FormControl key={key} isInvalid={errors[`personality.${key}`]}>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Text>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Text>
                      <Tooltip label={`How ${key.toLowerCase()} are you?`}>
                        <Icon as={FaBrain} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Slider
                    value={value === 'Low' ? 0 : value === 'Medium' ? 50 : 100}
                    onChange={(val) => {
                      const level = val === 0 ? 'Low' : val === 50 ? 'Medium' : 'High';
                      setProfile({
                        ...profile,
                        personality: { ...profile.personality, [key]: level },
                      });
                    }}
                    min={0}
                    max={100}
                    step={50}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                    <SliderMark value={0} mt={2} ml={-2.5}>
                      Low
                    </SliderMark>
                    <SliderMark value={50} mt={2} ml={-2.5}>
                      Medium
                    </SliderMark>
                    <SliderMark value={100} mt={2} ml={-2.5}>
                      High
                    </SliderMark>
                  </Slider>
                  <FormErrorMessage>{errors[`personality.${key}`]}</FormErrorMessage>
                </FormControl>
              ))}
            </VStack>
          </MotionBox>
        );
      case 5:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                Review Your Profile
              </Heading>
              <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                Take a final look at your profile before we start finding your matches.
              </Text>
              <Box
                bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
                p={6}
                borderRadius="xl"
                boxShadow="md"
              >
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <Avatar
                      size="xl"
                      name={profile.name}
                      src={profile.photoUrl}
                      icon={<FaUser />}
                      borderWidth="2px"
                      borderColor={colorMode === 'light' ? 'pink.200' : 'pink.700'}
                    />
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{profile.name}, {profile.age}</Heading>
                      <HStack spacing={2}>
                        <Icon as={FaMapMarkerAlt} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                        <Text>{profile.location}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <Divider />
                  <HStack spacing={4}>
                    <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
                      {profile.gender}
                    </Badge>
                    <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                      {profile.lookingFor}
                    </Badge>
                  </HStack>
                  <Text>{profile.bio}</Text>
                  <Divider />
                  <VStack align="stretch" spacing={2}>
                    {Object.entries(profile.personality).map(([key, value]) => (
                      <HStack key={key} justify="space-between">
                        <Text>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                          {value}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </MotionBox>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack spacing={2} align="stretch">
            <Progress value={(currentStep / totalSteps) * 100} size="sm" colorScheme="pink" />
            <HStack justify="space-between">
              <Text fontSize="sm" color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                Step {currentStep} of {totalSteps}
              </Text>
              <Text fontSize="sm" color={colorMode === 'light' ? 'gray.500' : 'gray.400'}>
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Collapse in={showError} animateOpacity>
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Please fix the following errors:</AlertTitle>
                <AlertDescription>
                  {Object.values(errors).map((error, index) => (
                    <Text key={index}>{error}</Text>
                  ))}
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowError(false)} />
            </Alert>
          </Collapse>
          {renderStep()}
        </ModalBody>
        <Box p={6} borderTopWidth="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}>
          <HStack spacing={4} justify="space-between">
            <Button
              onClick={handleBack}
              isDisabled={currentStep === 1}
              variant="outline"
              size="lg"
              leftIcon={<FaArrowLeft />}
            >
              Back
            </Button>
            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                colorScheme="pink"
                size="lg"
                leftIcon={isSubmitting ? <Spinner size="sm" /> : <FaCheck />}
                isLoading={isSubmitting}
              >
                Complete Profile
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                colorScheme="pink"
                size="lg"
                rightIcon={<FaArrowRight />}
              >
                Next
          </Button>
            )}
          </HStack>
    </Box>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;