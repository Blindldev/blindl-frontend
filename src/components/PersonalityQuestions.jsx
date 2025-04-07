import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { API_URL } from '../config';

const questions = [
  {
    id: 'energyLevel',
    question: 'How would you describe your energy level?',
    options: ['Low (I prefer quiet, relaxed environments)', 'Moderate (I enjoy a mix of activity and relaxation)', 'High (I thrive in energetic, dynamic environments)', 'Very High (I need constant stimulation and activity)', 'Variable (Depends on the situation and my mood)']
  },
  {
    id: 'socialPreference',
    question: 'How do you prefer to socialize?',
    options: ['Solo (I enjoy my own company)', 'One-on-one (I prefer deep conversations)', 'Small groups (3-5 people)', 'Large groups (6+ people)', 'Mix of all (I adapt to different situations)']
  },
  {
    id: 'decisionMaking',
    question: 'How do you typically make decisions?',
    options: ['Analytical (I carefully weigh all options)', 'Intuitive (I go with my gut feeling)', 'Practical (I consider what works best)', 'Emotional (I follow my heart)', 'Collaborative (I like to discuss with others)']
  },
  {
    id: 'conflictResolution',
    question: 'How do you handle conflicts?',
    options: ['Direct (I address issues head-on)', 'Diplomatic (I try to find common ground)', 'Avoidant (I prefer to let things pass)', 'Collaborative (I work together to find solutions)', 'Analytical (I break down the problem)']
  },
  {
    id: 'loveLanguage',
    question: 'What makes you feel most loved and appreciated?',
    options: ['Quality Time (Undivided attention)', 'Words of Affirmation (Compliments and encouragement)', 'Acts of Service (Helpful actions)', 'Gifts (Thoughtful presents)', 'Physical Touch (Hugs, holding hands)']
  },
  {
    id: 'idealFirstDate',
    question: 'What type of first date would you prefer?',
    options: ['Traditional (Coffee or drinks)', 'Group Activity (Mini golf, escape room)', 'Creative (Art class, pottery making)', 'Adventure (Rock climbing, hiking)', 'Cultural (Museum, concert)']
  }
];

const PersonalityQuestions = () => {
  const [answers, setAnswers] = useState({});
  const [idealPartner, setIdealPartner] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const toast = useToast();

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profiles/${profile.id}/personality`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personality: answers,
          idealPartner,
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save personality profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      toast({
        title: 'Success!',
        description: 'Your personality profile has been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={6}>
        <Heading size="lg">Personality Profile</Heading>
        <Text>Question {currentQuestion + 1} of {questions.length + 1}</Text>

        {currentQuestion < questions.length ? (
          <>
            <FormControl>
              <FormLabel fontSize="lg">{questions[currentQuestion].question}</FormLabel>
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ''}
                onChange={handleAnswer}
              >
                <VStack align="start" spacing={4}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </FormControl>

            <HStack spacing={4} width="100%">
              <Button
                onClick={handlePrevious}
                isDisabled={currentQuestion === 0}
                flex={1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                isDisabled={!answers[questions[currentQuestion].id]}
                colorScheme="blue"
                flex={1}
              >
                Next
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <FormControl>
              <FormLabel fontSize="lg">Describe your ideal partner</FormLabel>
              <Textarea
                value={idealPartner}
                onChange={(e) => setIdealPartner(e.target.value)}
                placeholder="What qualities are you looking for in a partner?"
                size="lg"
                minH="200px"
              />
            </FormControl>

            <HStack spacing={4} width="100%">
              <Button
                onClick={handlePrevious}
                flex={1}
              >
                Previous
              </Button>
              <Button
                onClick={handleSubmit}
                colorScheme="blue"
                flex={1}
                isDisabled={!idealPartner.trim()}
              >
                Submit
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PersonalityQuestions; 