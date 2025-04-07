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
} from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (!profile) {
      navigate('/profile');
      return;
    }
  }, [profile, navigate]);

  const handleProfileUpdate = (updatedProfile) => {
    // Convert interests and hobbies strings to arrays
    const processedProfile = {
      ...updatedProfile,
      interests: updatedProfile.interests ? updatedProfile.interests.split(',').map(item => item.trim()) : [],
      hobbies: updatedProfile.hobbies ? updatedProfile.hobbies.split(',').map(item => item.trim()) : []
    };
    setProfile(processedProfile);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!profile) {
    return null;
  }

  // Ensure interests and hobbies are arrays
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const hobbies = Array.isArray(profile.hobbies) ? profile.hobbies : [];

  return (
    <Box minH="100vh" py={4} px={2} bg="gray.50" position="relative">
      <Container maxW="container.sm" pb={20}>
        <VStack spacing={6}>
          {/* Profile Card */}
          <Box
            w="100%"
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            border="1px"
            borderColor={borderColor}
            position="relative"
          >
            <Button
              position="absolute"
              top="4"
              right="4"
              colorScheme="blue"
              size="sm"
              onClick={onOpen}
            >
              Edit Profile
            </Button>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4} align="start">
                <Avatar
                  size="xl"
                  src={profile.photo}
                  name={profile.name}
                />
                <VStack align="start" spacing={1}>
                  <Heading size="md">{profile.name}, {profile.age}</Heading>
                  <Text color="gray.600">{profile.occupation}</Text>
                  <Text color="gray.600">{profile.education}</Text>
                  <Text color="gray.600">{profile.location}</Text>
                </VStack>
              </HStack>
              
              <Box>
                <Text fontWeight="bold" mb={2}>About Me</Text>
                <Text color="gray.600">{profile.bio}</Text>
              </Box>

              <SimpleGrid columns={2} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Interests</Text>
                  <Wrap spacing={2}>
                    {interests.map((interest, index) => (
                      <WrapItem key={index}>
                        <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>
                          {interest}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Hobbies</Text>
                  <Wrap spacing={2}>
                    {hobbies.map((hobby, index) => (
                      <WrapItem key={index}>
                        <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                          {hobby}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={6}>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Languages</Text>
                  <Wrap spacing={2}>
                    {(Array.isArray(profile.languages) ? profile.languages : profile.languages?.split(',').map(lang => lang.trim()) || []).map((lang, index) => (
                      <WrapItem key={index}>
                        <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                          {lang}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Looking For</Text>
                  <Wrap spacing={2}>
                    {(Array.isArray(profile.relationshipGoals) ? profile.relationshipGoals : profile.relationshipGoals?.split(',').map(goal => goal.trim()) || []).map((goal, index) => (
                      <WrapItem key={index}>
                        <Badge colorScheme="orange" fontSize="sm" px={2} py={1}>
                          {goal}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Status Message */}
          <Box textAlign="center" mb={4}>
            <Text fontSize="lg" color="gray.600" mb={2}>
              We are looking through and waiting for a good potential match... we will notify you if we find one!
            </Text>
            <Text fontSize="md" color="gray.500">
              You can close the app - we'll notify you via push notifications or email when we find a match.
            </Text>
          </Box>

          {/* Blurred Profiles */}
          <BlurredProfiles />

          {/* Push Notification Button */}
          <Box w="100%" textAlign="center" mt={4}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => {
                toast({
                  title: 'Push Notifications',
                  description: 'Push notifications will be enabled in a future update.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Enable Push Notifications
            </Button>
          </Box>

          {/* Memory Game - Temporarily Commented Out */}
          {/* <Box
            w="100%"
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            border="1px"
            borderColor={borderColor}
          >
            <MemoryGame />
          </Box> */}
        </VStack>
      </Container>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isOpen}
        onClose={onClose}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />

      {/* Footer */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        py={4}
        borderTop="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Link
          href="https://instagram.com/blinddatepottery"
          isExternal
          color="gray.600"
          _hover={{ color: 'pink.500' }}
        >
          <HStack spacing={2} justify="center">
            <Icon as={FaInstagram} boxSize={5} />
            <Text>Follow @blinddatepottery for updates</Text>
          </HStack>
        </Link>
      </Box>
    </Box>
  );
};

export default WaitingScreen;
