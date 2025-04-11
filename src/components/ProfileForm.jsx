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
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from 'react-icons/fa';

const ProfileForm = ({ isOpen, onClose, initialData, onProfileUpdate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bioLength, setBioLength] = useState(0);
  const [profile, setProfile] = useState(initialData || {
    name: '',
    age: '',
    location: '',
    gender: '',
    lookingFor: '',
    bio: '',
    occupation: '',
    education: '',
    relationshipGoals: '',
    smoking: '',
    drinking: '',
    photos: [],
    interests: [],
    hobbies: [],
    languages: [],
    firstDateIdeas: [],
    personality: {
      openness: '',
      conscientiousness: '',
      extraversion: '',
      agreeableness: '',
      neuroticism: '',
    },
  });
  const [errors, setErrors] = useState({});
  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newDateIdea, setNewDateIdea] = useState('');
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
        if (!profile.gender) newErrors.gender = 'Gender is required';
        if (!profile.lookingFor) newErrors.lookingFor = 'Looking for is required';
        break;
      case 2:
        if (!profile.occupation) newErrors.occupation = 'Occupation is required';
        if (!profile.education) newErrors.education = 'Education is required';
        if (!profile.relationshipGoals) newErrors.relationshipGoals = 'Relationship goals are required';
        if (!profile.smoking) newErrors.smoking = 'Smoking preference is required';
        if (!profile.drinking) newErrors.drinking = 'Drinking preference is required';
        break;
      case 3:
        if (!profile.bio) newErrors.bio = 'Bio is required';
        if (profile.bio.length < 50) newErrors.bio = 'Bio must be at least 50 characters';
        if (profile.interests.length === 0) newErrors.interests = 'At least one interest is required';
        if (profile.hobbies.length === 0) newErrors.hobbies = 'At least one hobby is required';
        break;
      case 4:
        if (profile.languages.length === 0) newErrors.languages = 'At least one language is required';
        if (profile.firstDateIdeas.length === 0) newErrors.firstDateIdeas = 'At least one date idea is required';
        break;
      case 5:
        if (!profile.personality.openness) newErrors.personality = 'Please complete your personality profile';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleBioChange = (e) => {
    const value = e.target.value;
    setProfile(prev => ({ ...prev, bio: value }));
    setBioLength(value.length);
  };

  const addItem = (type, value, setValue) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
      setValue('');
    }
  };

  const removeItem = (type, index) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        await onProfileUpdate(profile);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: 'Error updating profile',
          description: error.message,
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
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.age}>
              <FormLabel>Age</FormLabel>
              <NumberInput
                value={profile.age}
                onChange={(value) => setProfile(prev => ({ ...prev, age: value }))}
                min={18}
                max={100}
              >
                <NumberInputField placeholder="Your age" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.age}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <Input
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Your location"
              />
              <FormErrorMessage>{errors.location}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.gender}>
              <FormLabel>Gender</FormLabel>
              <Select
                value={profile.gender}
                onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                placeholder="Select gender"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </Select>
              <FormErrorMessage>{errors.gender}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.lookingFor}>
              <FormLabel>Looking For</FormLabel>
              <Select
                value={profile.lookingFor}
                onChange={(e) => setProfile(prev => ({ ...prev, lookingFor: e.target.value }))}
                placeholder="Select preference"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Both">Both</option>
              </Select>
              <FormErrorMessage>{errors.lookingFor}</FormErrorMessage>
            </FormControl>
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.occupation}>
              <FormLabel>Occupation</FormLabel>
              <Input
                value={profile.occupation}
                onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                placeholder="Your occupation"
              />
              <FormErrorMessage>{errors.occupation}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.education}>
              <FormLabel>Education</FormLabel>
              <Input
                value={profile.education}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Your education"
              />
              <FormErrorMessage>{errors.education}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.relationshipGoals}>
              <FormLabel>Relationship Goals</FormLabel>
              <Select
                value={profile.relationshipGoals}
                onChange={(e) => setProfile(prev => ({ ...prev, relationshipGoals: e.target.value }))}
                placeholder="Select relationship goals"
              >
                <option value="Dating">Dating</option>
                <option value="Long-term Relationship">Long-term Relationship</option>
                <option value="Marriage">Marriage</option>
                <option value="Friendship">Friendship</option>
              </Select>
              <FormErrorMessage>{errors.relationshipGoals}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.smoking}>
              <FormLabel>Smoking</FormLabel>
              <Select
                value={profile.smoking}
                onChange={(e) => setProfile(prev => ({ ...prev, smoking: e.target.value }))}
                placeholder="Select smoking preference"
              >
                <option value="Never">Never</option>
                <option value="Socially">Socially</option>
                <option value="Regularly">Regularly</option>
              </Select>
              <FormErrorMessage>{errors.smoking}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.drinking}>
              <FormLabel>Drinking</FormLabel>
              <Select
                value={profile.drinking}
                onChange={(e) => setProfile(prev => ({ ...prev, drinking: e.target.value }))}
                placeholder="Select drinking preference"
              >
                <option value="Never">Never</option>
                <option value="Socially">Socially</option>
                <option value="Regularly">Regularly</option>
              </Select>
              <FormErrorMessage>{errors.drinking}</FormErrorMessage>
            </FormControl>
          </VStack>
        );
      case 3:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.bio}>
              <FormLabel>Bio</FormLabel>
              <Textarea
                value={profile.bio}
                onChange={handleBioChange}
                placeholder="Tell us about yourself..."
                maxLength={maxBioLength}
              />
              <Text fontSize="sm" color={bioLength > maxBioLength ? 'red.500' : 'gray.500'}>
                {bioLength}/{maxBioLength} characters
              </Text>
              <FormErrorMessage>{errors.bio}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.interests}>
              <FormLabel>Interests</FormLabel>
              <HStack>
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                />
                <Button onClick={() => addItem('interests', newInterest, setNewInterest)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2} spacing={2}>
                {profile.interests.map((interest, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('interests', index)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.interests}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.hobbies}>
              <FormLabel>Hobbies</FormLabel>
              <HStack>
                <Input
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  placeholder="Add a hobby"
                />
                <Button onClick={() => addItem('hobbies', newHobby, setNewHobby)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2} spacing={2}>
                {profile.hobbies.map((hobby, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="green">
                      <TagLabel>{hobby}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('hobbies', index)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.hobbies}</FormErrorMessage>
            </FormControl>
          </VStack>
        );
      case 4:
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.languages}>
              <FormLabel>Languages</FormLabel>
              <HStack>
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language"
                />
                <Button onClick={() => addItem('languages', newLanguage, setNewLanguage)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2} spacing={2}>
                {profile.languages.map((language, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="purple">
                      <TagLabel>{language}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('languages', index)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.languages}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.firstDateIdeas}>
              <FormLabel>First Date Ideas</FormLabel>
              <HStack>
                <Input
                  value={newDateIdea}
                  onChange={(e) => setNewDateIdea(e.target.value)}
                  placeholder="Add a date idea"
                />
                <Button onClick={() => addItem('firstDateIdeas', newDateIdea, setNewDateIdea)}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2} spacing={2}>
                {profile.firstDateIdeas.map((idea, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="pink">
                      <TagLabel>{idea}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('firstDateIdeas', index)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <FormErrorMessage>{errors.firstDateIdeas}</FormErrorMessage>
            </FormControl>
          </VStack>
        );
      case 5:
        return (
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Personality Profile</Text>
            <Text fontSize="sm" color="gray.500">
              Rate yourself on these personality traits (1-10)
            </Text>
            {Object.entries(profile.personality).map(([trait, value]) => (
              <FormControl key={trait} isInvalid={errors.personality}>
                <FormLabel>{trait.charAt(0).toUpperCase() + trait.slice(1)}</FormLabel>
                <Slider
                  value={value || 5}
                  onChange={(val) => setProfile(prev => ({
                    ...prev,
                    personality: { ...prev.personality, [trait]: val }
                  }))}
                  min={1}
                  max={10}
                  step={1}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                  <SliderMark value={value || 5} mt={1} ml={-2.5}>
                    {value || 5}
                  </SliderMark>
                </Slider>
              </FormControl>
            ))}
          </VStack>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Edit Profile</Text>
            <Text fontSize="sm" color="gray.500">
              Step {currentStep} of {totalSteps}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Progress value={(currentStep / totalSteps) * 100} mb={4} />
          {renderStep()}
          <HStack justify="space-between" mt={6}>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={handleBack}
              isDisabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep === totalSteps ? (
              <Button
                rightIcon={<FaCheck />}
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Save Profile
              </Button>
            ) : (
              <Button
                rightIcon={<FaArrowRight />}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm;