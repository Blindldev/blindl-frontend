import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  useColorMode,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  HStack,
  Badge,
  Image,
  Flex,
  Icon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaHeart, FaTimes, FaUser, FaMapMarkerAlt, FaVenusMars, FaSearch } from 'react-icons/fa';

const BlurredProfiles = () => {
  const { colorMode } = useColorMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 3);
    }, 3000);

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
      gender: 'Female',
      lookingFor: 'Dating',
      age: 28,
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Potential Match 2',
      location: 'Nearby',
      bio: 'Ready to meet new people',
      gender: 'Male',
      lookingFor: 'Friendship',
      age: 32,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
      name: 'Potential Match 3',
      location: 'Nearby',
      bio: 'Excited to connect',
      gender: 'Other',
      lookingFor: 'Relationship',
      age: 25,
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
  ];

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {[1, 2].map((i) => (
          <Box
            key={i}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          >
            <Skeleton height="300px" />
            <Box p={6}>
              <Skeleton height="24px" width="60%" mb={4} />
              <SkeletonText noOfLines={3} spacing="4" />
              <HStack spacing={2} mt={4}>
                <Skeleton height="20px" width="60px" />
                <Skeleton height="20px" width="60px" />
                <Skeleton height="20px" width="60px" />
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  const currentProfile = blurredProfiles[currentIndex];

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        position="relative"
      >
        <Box
          position="relative"
          height="300px"
          filter="blur(8px)"
          transition="all 0.3s ease"
        >
          <Image
            src={currentProfile.photoUrl}
            alt={currentProfile.name}
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0,0,0,0.3)"
          />
        </Box>

        <Box p={6}>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                {currentProfile.name}, {currentProfile.age}
              </Heading>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => toast({
                    title: 'Not interested',
                    description: 'We\'ll show you different matches',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  })}
                >
                  <Icon as={FaTimes} />
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  onClick={() => toast({
                    title: 'Match!',
                    description: 'Complete your profile to see your matches',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })}
                >
                  <Icon as={FaHeart} />
                </Button>
              </HStack>
            </Flex>

            <HStack spacing={4}>
              <HStack spacing={1}>
                <Icon as={FaMapMarkerAlt} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                  {currentProfile.location}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaVenusMars} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                <Badge colorScheme="purple" variant="subtle">
                  {currentProfile.gender}
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FaSearch} color={colorMode === 'light' ? 'gray.500' : 'gray.400'} />
                <Badge colorScheme="green" variant="subtle">
                  {currentProfile.lookingFor}
                </Badge>
              </HStack>
            </HStack>

            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              {currentProfile.bio}
            </Text>

            <Button
              colorScheme="pink"
              variant="solid"
              size="lg"
              borderRadius="full"
              leftIcon={<FaHeart />}
              onClick={() => toast({
                title: 'Complete your profile',
                description: 'Fill out your profile to see your matches',
                status: 'info',
                duration: 3000,
                isClosable: true,
              })}
            >
              See Full Profile
            </Button>
          </VStack>
        </Box>
      </Box>

      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius="2xl"
        p={6}
        boxShadow="lg"
        borderWidth="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Icon as={FaUser} w={12} h={12} color={colorMode === 'light' ? 'gray.400' : 'gray.500'} />
          <Heading size="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
            Complete Your Profile
          </Heading>
          <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
            Add more details to your profile to see your potential matches and increase your chances of finding the perfect connection.
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            size="lg"
            borderRadius="full"
            onClick={() => toast({
              title: 'Edit your profile',
              description: 'Click the edit button on your profile to add more details',
              status: 'info',
              duration: 3000,
              isClosable: true,
            })}
          >
            Edit Profile
          </Button>
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

export default BlurredProfiles; 