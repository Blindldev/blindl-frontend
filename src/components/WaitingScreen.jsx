import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  Container,
  Heading,
  Avatar,
  SimpleGrid,
  Badge,
  Progress,
  useColorModeValue,
  Button,
  Grid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Wrap,
  WrapItem,
  HStack,
  Icon,
  Link,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import BlurredProfiles from './BlurredProfiles';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const emojis = ['❤️', '💖', '💝', '💕', '💗', '💓', '💞', '💟'];
  const totalPairs = emojis.length;

  const initializeGame = () => {
    setIsLoading(true);
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffledCards = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(false);
    setGameComplete(false);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (cardId) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;
      
      if (cards[firstCard].emoji === cards[secondCard].emoji) {
        const matchedCards = newCards.map(card =>
          card.id === firstCard || card.id === secondCard
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setMatchedPairs(prev => prev + 1);
        
        if (matchedPairs + 1 === totalPairs) {
          setGameComplete(true);
        }
      } else {
        setTimeout(() => {
          const resetCards = newCards.map(card =>
            card.id === firstCard || card.id === secondCard
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (isLoading) {
    return <Text>Loading game...</Text>;
  }

  return (
    <VStack spacing={4} w="100%">
      <Heading size="md">Match the Emojis</Heading>
      <SimpleGrid columns={4} spacing={2} w="100%">
        {cards.map(card => (
          <Box
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            cursor="pointer"
            bg={card.isFlipped || card.isMatched ? 'blue.100' : 'gray.100'}
            p={4}
            borderRadius="md"
            textAlign="center"
            fontSize="2xl"
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)' }}
            minH="60px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {(card.isFlipped || card.isMatched) && card.emoji}
          </Box>
        ))}
      </SimpleGrid>
      <SimpleGrid columns={2} spacing={4} w="100%">
        <Text>Moves: {moves}</Text>
        <Text>Pairs Found: {matchedPairs}/{totalPairs}</Text>
      </SimpleGrid>
      {gameComplete && (
        <VStack spacing={2}>
          <Text color="green.500" fontWeight="bold">Congratulations! You won!</Text>
          <Button colorScheme="blue" onClick={initializeGame}>
            Play Again
          </Button>
        </VStack>
      )}
      {!gameComplete && gameStarted && (
        <Button colorScheme="blue" onClick={initializeGame}>
          Reset Game
        </Button>
      )}
    </VStack>
  );
};

const EditProfileModal = ({ isOpen, onClose, profile, onUpdate }) => {
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedProfile);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Your Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  placeholder="Your full name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({...editedProfile, age: e.target.value})}
                  placeholder="Your age"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                  placeholder="City, Country"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Occupation</FormLabel>
                <Input
                  value={editedProfile.occupation}
                  onChange={(e) => setEditedProfile({...editedProfile, occupation: e.target.value})}
                  placeholder="Your profession"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Education</FormLabel>
                <Input
                  value={editedProfile.education}
                  onChange={(e) => setEditedProfile({...editedProfile, education: e.target.value})}
                  placeholder="Your education level"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Profile Photo URL</FormLabel>
                <Input
                  type="url"
                  value={editedProfile.photo}
                  onChange={(e) => setEditedProfile({...editedProfile, photo: e.target.value})}
                  placeholder="https://example.com/your-photo.jpg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Interests</FormLabel>
                <Textarea
                  value={editedProfile.interests}
                  onChange={(e) => setEditedProfile({...editedProfile, interests: e.target.value})}
                  placeholder="What are you passionate about?"
                  rows={2}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Hobbies</FormLabel>
                <Textarea
                  value={editedProfile.hobbies}
                  onChange={(e) => setEditedProfile({...editedProfile, hobbies: e.target.value})}
                  placeholder="What do you like to do in your free time?"
                  rows={2}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Languages</FormLabel>
                <Input
                  value={editedProfile.languages}
                  onChange={(e) => setEditedProfile({...editedProfile, languages: e.target.value})}
                  placeholder="Languages you speak"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Relationship Goals</FormLabel>
                <Select
                  value={editedProfile.relationshipGoals}
                  onChange={(e) => setEditedProfile({...editedProfile, relationshipGoals: e.target.value})}
                >
                  <option value="">Select your relationship goals</option>
                  <option value="casual">Casual Dating</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="marriage">Marriage</option>
                  <option value="friendship">Friendship</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Deal Breakers</FormLabel>
                <Textarea
                  value={editedProfile.dealBreakers}
                  onChange={(e) => setEditedProfile({...editedProfile, dealBreakers: e.target.value})}
                  placeholder="What are your deal breakers?"
                  rows={2}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                Save Changes
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const WaitingScreen = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();
  const { colorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    if (!profile) {
      navigate('/');
      return;
    }
  }, [profile, navigate]);

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8}>
          <HStack justify="space-between" width="100%">
            <Heading size="lg">Welcome, {profile?.name || 'Friend'}!</Heading>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>

          <Box
            p={8}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            borderRadius="lg"
            boxShadow="lg"
            width="100%"
          >
            <VStack spacing={6}>
              <Center>
                <Spinner size="xl" color="blue.500" />
              </Center>
              <Heading size="md">Finding Your Perfect Match</Heading>
              <Text textAlign="center">
                We're analyzing your profile and preferences to find the best matches for you.
                This might take a few moments...
              </Text>
              <Text textAlign="center" color="gray.500">
                While you wait, why not complete your personality profile to improve your matches?
              </Text>
              <Button
                colorScheme="purple"
                onClick={() => navigate('/personality')}
              >
                Complete Personality Profile
              </Button>
            </VStack>
          </Box>

          <BlurredProfiles />

          <Box textAlign="center" width="100%">
            <Text fontSize="md" color="gray.500">
              You can close the app - we'll notify you when we find a match.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default WaitingScreen;
