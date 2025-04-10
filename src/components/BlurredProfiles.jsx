import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  useColorMode,
  HStack,
  Badge,
  useToast,
  Skeleton,
  SkeletonText,
  Container,
  SimpleGrid,
} from '@chakra-ui/react';
import { useProfile } from '../context/ProfileContext';
import { API_URL } from '../config';

const BlurredProfiles = () => {
  const { profile } = useProfile();
  const { colorMode } = useColorMode();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/profiles`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        setProfiles(data.filter(p => p.id !== profile?.id));
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profiles',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (profile) {
      fetchProfiles();
    }
  }, [profile, toast]);

  if (!profile) {
    return null;
  }

  const ProfileSkeleton = () => (
    <Box
      p={6}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        <Skeleton height="24px" width="60%" />
        <SkeletonText noOfLines={3} spacing="4" />
        <HStack spacing={2}>
          <Skeleton height="20px" width="60px" />
          <Skeleton height="20px" width="60px" />
          <Skeleton height="20px" width="60px" />
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="md" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
          Potential Matches
        </Heading>
        
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <ProfileSkeleton />
            <ProfileSkeleton />
          </SimpleGrid>
        ) : profiles.length === 0 ? (
          <Box
            p={6}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="md"
            textAlign="center"
          >
            <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
              No potential matches found yet. Check back later!
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {profiles.map((p) => (
              <Box
                key={p.id}
                p={6}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                borderRadius="lg"
                boxShadow="md"
                transition="transform 0.2s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="xl" fontWeight="bold" color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
                      {p.name}, {p.age}
                    </Text>
                  </HStack>
                  
                  <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    {p.bio}
                  </Text>
                  
                  <HStack spacing={2}>
                    <Badge colorScheme="purple" variant="subtle">{p.gender}</Badge>
                    <Badge colorScheme="blue" variant="subtle">{p.location}</Badge>
                    <Badge colorScheme="green" variant="subtle">{p.lookingFor}</Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default BlurredProfiles; 