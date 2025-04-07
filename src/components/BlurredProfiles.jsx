import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

const BlurredProfiles = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const blurredProfiles = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&blur=20',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&blur=20',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&blur=20',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&blur=20',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&blur=20'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % blurredProfiles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [blurredProfiles.length]);

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      minH="200px"
      bg="gray.50"
      borderRadius="lg"
      p={4}
      position="relative"
      overflow="hidden"
      width="100%"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage={`url(${blurredProfiles[currentImageIndex]})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="blur(20px)"
        transform="scale(1.1)"
      />
      <Box
        position="relative"
        zIndex={1}
        textAlign="center"
        color="white"
        textShadow="0 2px 4px rgba(0,0,0,0.5)"
      >
        <Text fontSize="xl" fontWeight="bold">
          Finding your perfect match...
        </Text>
      </Box>
    </Box>
  );
};

export default BlurredProfiles; 