import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  useColorMode,
  Card,
  CardBody,
  Heading,
  Spinner,
} from '@chakra-ui/react';

const BlurredProfiles = () => {
  const { colorMode } = useColorMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 3);
    }, 3000);

    // Simulate loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const blurredProfiles = [
    {
      name: 'Potential Match 1',
      location: 'Nearby',
      bio: 'Looking for meaningful connections',
    },
    {
      name: 'Potential Match 2',
      location: 'Nearby',
      bio: 'Ready to meet new people',
    },
    {
      name: 'Potential Match 3',
      location: 'Nearby',
      bio: 'Excited to connect',
    },
  ];

  if (isLoading) {
    return (
      <Card bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <CardBody>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading potential matches...</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg={colorMode === 'light' ? 'white' : 'gray.800'}>
      <CardBody>
        <VStack spacing={4}>
          <Heading size="md">Potential Matches</Heading>
          <Box
            filter="blur(8px)"
            transition="all 0.3s ease"
            transform={`scale(${currentIndex === 0 ? 1 : 0.95})`}
          >
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                {blurredProfiles[currentIndex].name}
              </Text>
              <Text>{blurredProfiles[currentIndex].location}</Text>
              <Text>{blurredProfiles[currentIndex].bio}</Text>
            </VStack>
          </Box>
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            Complete your profile to see your matches!
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BlurredProfiles; 