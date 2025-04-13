import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  useBreakpointValue,
  Select,
  Textarea,
  FormErrorMessage,
  HStack,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const CHICAGO_NEIGHBORHOODS = [
  'Lincoln Park', 'Wicker Park', 'Lakeview', 'Logan Square', 'River North',
  'West Loop', 'Gold Coast', 'Old Town', 'Bucktown', 'Pilsen'
];

const INTERESTS = [
  'Art', 'Music', 'Sports', 'Technology', 'Cooking', 'Travel', 'Photography',
  'Reading', 'Movies', 'Fitness', 'Gaming', 'Nature', 'Fashion', 'Dancing'
];

const HOBBIES = [
  'Hiking', 'Painting', 'Playing Guitar', 'Yoga', 'Chess', 'Gardening',
  'Writing', 'Cycling', 'Swimming', 'Knitting', 'Pottery', 'Running'
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic'
];

const FIRST_DATE_IDEAS = [
  'Coffee at a local cafe', 'Walk in the park', 'Visit to an art museum',
  'Picnic by the lake', 'Cooking class', 'Wine tasting', 'Bowling',
  'Mini golf', 'Concert', 'Food truck festival'
];

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email');
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [tempInterest, setTempInterest] = useState('');
  const [tempHobby, setTempHobby] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');
  const [tempDateIdea, setTempDateIdea] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { setProfile } = useProfile();
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  // Responsive styles
  const containerWidth = useBreakpointValue({ base: '100%', md: 'md' });
  const padding = useBreakpointValue({ base: 4, md: 10 });
  const buttonSize = useBreakpointValue({ base: 'lg', md: 'md' });
  const fontSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large' }
        );
        setGoogleScriptLoaded(true);
      }
    };

    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        toast({
          title: 'Error',
          description: 'Failed to load Google Sign-In. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      };
      document.body.appendChild(script);
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGoogleSignIn();
    }
  }, [toast]);

  const handleGoogleSignIn = async (response) => {
    try {
      setIsLoading(true);
      console.log('Google Sign-In response:', response);

      const result = await fetch('http://localhost:3002/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
        credentials: 'include'
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Failed to sign in with Google');
      }

      const data = await result.json();
      console.log('Google auth response:', data);

      if (data.isNewUser) {
        setStep('profile');
      } else {
        setProfile(data.profile);
        navigate('/waiting');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
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

  const loadRandomTestProfile = () => {
    const testEmails = [
      'alex.thompson@example.com',
      'sarah.chen@example.com',
      'marcus.johnson@example.com'
    ];
    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)];
    setEmail(randomEmail);
    setPassword('test123');
    setStep('password');
    toast({
      title: 'Test Profile Loaded',
      description: `Loaded profile for ${randomEmail.split('@')[0].replace('.', ' ')}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const result = await fetch('http://localhost:3002/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
        credentials: 'include'
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Failed to verify email');
      }

      const data = await result.json();
      console.log('Email check response:', data);
      
      setIsNewUser(!data.exists);
      setStep('password');
    } catch (error) {
      console.error('Email verification error:', error);
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Attempting sign in with:', { email, isNewUser, password, confirmPassword });

      // For new users, check password confirmation
      if (isNewUser && password !== confirmPassword) {
        console.log('Passwords do not match for new user');
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://localhost:3002/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          isNewUser
        }),
      });

      console.log('Sign in response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Sign in error response:', errorData);
        throw new Error(errorData.error || 'Failed to sign in');
      }

      const data = await response.json();
      console.log('Sign in success response:', data);

      if (data.isNewUser) {
        setStep('profile');
      } else {
        setProfile(data.profile);
        navigate('/waiting');
      }
    } catch (error) {
      console.error('Sign in error:', error);
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

  const handleProfileChange = (e) => {
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

  const validateProfile = () => {
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

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
      
      // Set the profile in context before navigating
      setProfile(data.profile);

      toast({
        title: 'Profile created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Now sign in with the newly created profile
      const signInResponse = await fetch('http://localhost:3002/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          isNewUser: false
        }),
      });

      if (!signInResponse.ok) {
        throw new Error('Failed to sign in after profile creation');
      }

      const signInData = await signInResponse.json();
      console.log('Sign in after profile creation:', signInData);
      
      // Set the profile again with the complete data
      setProfile(signInData.profile);
      
      // Navigate to waiting screen
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

  const fillRandomData = () => {
    const randomName = `Test User ${Math.floor(Math.random() * 1000)}`;
    const randomAge = Math.floor(Math.random() * 30) + 20;
    const randomGender = ['male', 'female', 'other'][Math.floor(Math.random() * 3)];
    const randomLookingFor = ['relationship', 'friendship', 'casual'][Math.floor(Math.random() * 3)];
    const randomLocation = CHICAGO_NEIGHBORHOODS[Math.floor(Math.random() * CHICAGO_NEIGHBORHOODS.length)];
    const randomOccupation = ['Software Engineer', 'Teacher', 'Artist', 'Doctor', 'Chef'][Math.floor(Math.random() * 5)];
    const randomEducation = ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'High School Diploma'][Math.floor(Math.random() * 4)];
    const randomBio = 'This is a test bio for development purposes. I enjoy various activities and am looking to meet new people.';
    const randomRelationshipGoals = ['long-term', 'marriage', 'casual', 'friendship'][Math.floor(Math.random() * 4)];
    const randomSmoking = ['never', 'socially', 'regularly'][Math.floor(Math.random() * 3)];
    const randomDrinking = ['never', 'socially', 'regularly'][Math.floor(Math.random() * 3)];

    // Helper function to get random items from an array
    const getRandomItems = (array, count) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    setFormData({
      name: randomName,
      age: randomAge,
      gender: randomGender,
      lookingFor: randomLookingFor,
      location: randomLocation,
      occupation: randomOccupation,
      education: randomEducation,
      bio: randomBio,
      interests: getRandomItems(INTERESTS, 3),
      hobbies: getRandomItems(HOBBIES, 3),
      languages: getRandomItems(LANGUAGES, 2),
      relationshipGoals: randomRelationshipGoals,
      smoking: randomSmoking,
      drinking: randomDrinking,
      firstDateIdeas: getRandomItems(FIRST_DATE_IDEAS, 2),
    });

    toast({
      title: 'Random Data Loaded',
      description: 'Form filled with random test data',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW={containerWidth} py={padding} px={padding}>
        <VStack spacing={8} w="100%">
          <Text fontSize={fontSize} fontWeight="bold" textAlign="center">
            Welcome to Blindl
          </Text>
          
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    size={buttonSize}
                    fontSize={{ base: 'md', md: 'md' }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  size={buttonSize}
                  isLoading={isLoading}
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  onClick={loadRandomTestProfile}
                  width="100%"
                  size={buttonSize}
                  isDisabled={isLoading}
                >
                  Load Test Profile
                </Button>
                <Box id="googleSignInButton" w="100%" display="flex" justifyContent="center" />
              </VStack>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
              <VStack spacing={6}>
                <Button
                  onClick={() => setStep('email')}
                  variant="outline"
                  colorScheme="gray"
                  width="100%"
                  size={buttonSize}
                >
                  Back to Email
                </Button>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    size={buttonSize}
                    fontSize={{ base: 'md', md: 'md' }}
                  />
                </FormControl>
                {isNewUser && (
                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      size={buttonSize}
                      fontSize={{ base: 'md', md: 'md' }}
                    />
                  </FormControl>
                )}
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  size={buttonSize}
                  isLoading={isLoading}
                >
                  {isNewUser ? 'Create Account' : 'Sign In'}
                </Button>
              </VStack>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} style={{ width: '100%' }}>
              <VStack spacing={6}>
                <Button
                  onClick={fillRandomData}
                  colorScheme="purple"
                  variant="outline"
                  width="100%"
                  size={buttonSize}
                >
                  Fill Random Data (Dev)
                </Button>
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
                    placeholder="Your age"
                  />
                  <FormErrorMessage>{errors.age}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.gender}>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
                    placeholder="Your occupation"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Education</FormLabel>
                  <Input
                    name="education"
                    value={formData.education}
                    onChange={handleProfileChange}
                    placeholder="Your education"
                  />
                </FormControl>

                <FormControl isInvalid={errors.bio}>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
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
                  Complete Profile
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SignIn; 