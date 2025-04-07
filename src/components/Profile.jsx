import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading>Your Profile</Heading>
          <Button
            as={Link}
            to="/personality"
            colorScheme="purple"
            leftIcon={<Icon as={FaUserAstronaut} />}
          >
            Complete Personality Profile
          </Button>
        </HStack>
        
        {/* ... rest of the existing profile content ... */}
      </VStack>
    </Box>
  );
};

export default Profile; 